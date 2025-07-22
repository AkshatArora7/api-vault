import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    // Verify the API key belongs to the user before deletion
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: id,
        userId: user.id
      },
      select: {
        id: true,
        name: true,
        service: true
      }
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    // Delete the API key (cascade will handle usage records)
    await prisma.apiKey.delete({
      where: { id: id }
    });

    console.log(`🗑️ API key deleted: ${apiKey.name} (${apiKey.service}) by user ${user.email}`);

    return NextResponse.json({ 
      message: 'API key deleted successfully',
      deletedKey: {
        id: apiKey.id,
        name: apiKey.name,
        service: apiKey.service
      }
    });

  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}


// Add this PUT method to your existing app/api/keys/[id]/route.ts file

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const { name, description, keyValue, service, environment, tags, isActive } = await req.json();

    // Validation
    if (!name || !service) {
      return NextResponse.json(
        { error: 'Name and service are required' },
        { status: 400 }
      );
    }

    // Verify the API key belongs to the user
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    });

    if (!existingKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      name: name.trim(),
      description: description?.trim() || null,
      service: service.trim(),
      environment: environment || existingKey.environment,
      isActive: isActive !== undefined ? isActive : existingKey.isActive,
    };

    // Only encrypt and update keyValue if provided
    if (keyValue && keyValue.trim()) {
      if (keyValue.length < 8) {
        return NextResponse.json(
          { error: 'API key must be at least 8 characters long' },
          { status: 400 }
        );
      }
      updateData.keyValue = encrypt(keyValue.trim());
    }

    // Update the API key with new tags
    const updatedApiKey = await prisma.apiKey.update({
      where: { id: id },
      data: {
        ...updateData,
        tags: {
          set: [], // Clear existing tags
          connectOrCreate: tags?.map((tagName: string) => ({
            where: { name: tagName.trim() },
            create: { 
              name: tagName.trim(),
              color: getRandomColor()
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

    console.log(`✏️ API key updated: ${updatedApiKey.name} by user ${user.email}`);

    // Return sanitized response
    return NextResponse.json({
      ...updatedApiKey,
      keyValue: '••••••••••••••••',
      usageCount: updatedApiKey._count.usage
    });

  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// Helper function (if not already present)
function getRandomColor(): string {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
