import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Updated type
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Await params before using
    const { id } = await params;

    // Verify the API key belongs to the user
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: id, // Now using awaited params
        userId: user.id
      }
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    if (!apiKey.isActive) {
      return NextResponse.json({ error: 'API key is inactive' }, { status: 403 });
    }

    // Decrypt the API key
    const decryptedKey = decrypt(apiKey.keyValue);
    
    // Update last used timestamp and log usage
    await Promise.all([
      prisma.apiKey.update({
        where: { id: id }, // Use awaited params
        data: { lastUsed: new Date() }
      }),
      prisma.apiKeyUsage.create({
        data: {
          apiKeyId: id, // Use awaited params
          endpoint: 'decrypt',
          success: true
        }
      })
    ]);

    console.log('Decrypted key successfully:', { keyId: id, keyLength: decryptedKey.length });

    return NextResponse.json({ 
      keyValue: decryptedKey,
      revealed: true 
    });

  } catch (error) {
    console.error('Error decrypting API key:', error);
    
    // Get params for error logging
    try {
      const { id } = await params;
      await prisma.apiKeyUsage.create({
        data: {
          apiKeyId: id,
          endpoint: 'decrypt',
          success: false
        }
      });
    } catch (logError) {
      console.error('Error logging failed usage:', logError);
    }

    return NextResponse.json(
      { error: 'Failed to decrypt API key' },
      { status: 500 }
    );
  }
}
