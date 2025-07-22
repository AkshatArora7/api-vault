import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';

export async function GET(req: NextRequest) {
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

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      include: {
        tags: true,
        _count: {
          select: { usage: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Don't return the actual key values for security
    const sanitizedKeys = apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      description: key.description,
      service: key.service,
      environment: key.environment,
      isActive: key.isActive,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
      lastUsed: key.lastUsed,
      tags: key.tags,
      usageCount: key._count.usage,
      keyValue: '••••••••••••••••', // Masked for security
    }));

    return NextResponse.json(sanitizedKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add this POST method to your existing app/api/keys/route.ts

export async function POST(req: NextRequest) {
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

    const { name, description, keyValue, service, environment, tags } = await req.json();

    // Validation
    if (!name || !keyValue || !service) {
      return NextResponse.json(
        { error: 'Name, API key, and service are required' },
        { status: 400 }
      );
    }

    if (keyValue.length < 8) {
      return NextResponse.json(
        { error: 'API key must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Encrypt the API key before storing
    const encryptedKey = encrypt(keyValue);

    // Create API key with tags
    const apiKey = await prisma.apiKey.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        keyValue: encryptedKey,
        service: service.trim(),
        environment: environment || 'production',
        userId: user.id,
        tags: {
          connectOrCreate: tags?.map((tagName: string) => ({
            where: { name: tagName.trim() },
            create: { 
              name: tagName.trim(),
              color: getRandomColor() // We'll create this function
            }
          })) || []
        }
      },
      include: {
        tags: true,
        _count: {
          select: { usage: true }
        }
      }
    });

    // Return sanitized response (no real key value)
    return NextResponse.json({
      ...apiKey,
      keyValue: '••••••••••••••••',
      usageCount: 0
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// Helper function for random tag colors
function getRandomColor(): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green  
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
