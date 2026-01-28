import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';
import { dbProjectToAppProject } from '@/lib/db/converters';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Parse JSON fields and convert to app format
    const parsed = {
      ...project,
      regulationResult: project.regulationResult ? JSON.parse(project.regulationResult) : null,
      gdcrClauses: project.gdcrClauses ? JSON.parse(project.gdcrClauses) : [],
      extractedData: project.extractedData ? JSON.parse(project.extractedData) : null,
    };

    return NextResponse.json({ project: dbProjectToAppProject(parsed) });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project. Please try again later.' },
      { status: 500 }
    );
  }
}

// Validation schema for project update (all fields optional)
const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  authority: z.string().optional(),
  zone: z.string().optional(),
  plotLength: z.number().positive().optional(),
  plotWidth: z.number().positive().optional(),
  plotArea: z.number().positive().optional(),
  isCornerPlot: z.boolean().optional(),
  roadWidthPrimary: z.number().positive().optional(),
  roadWidthSecondary: z.number().positive().optional(),
  intendedUse: z.string().optional(),
  heritage: z.boolean().optional(),
  toz: z.boolean().optional(),
  sez: z.boolean().optional(),
  status: z.string().optional(),
  reportId: z.string().optional(),
  thumbnail: z.string().optional(),
  regulationResult: z.any().optional(),
  gdcrClauses: z.any().optional(),
  extractedData: z.any().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validation = updateProjectSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify ownership
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.authority !== undefined) updateData.authority = data.authority;
    if (data.zone !== undefined) updateData.zone = data.zone;
    if (data.plotLength !== undefined) updateData.plotLength = data.plotLength;
    if (data.plotWidth !== undefined) updateData.plotWidth = data.plotWidth;
    if (data.plotArea !== undefined) updateData.plotArea = data.plotArea;
    if (data.isCornerPlot !== undefined) updateData.isCornerPlot = data.isCornerPlot;
    if (data.roadWidthPrimary !== undefined) updateData.roadWidthPrimary = data.roadWidthPrimary;
    if (data.roadWidthSecondary !== undefined) updateData.roadWidthSecondary = data.roadWidthSecondary;
    if (data.intendedUse !== undefined) updateData.intendedUse = data.intendedUse;
    if (data.heritage !== undefined) updateData.heritage = data.heritage;
    if (data.toz !== undefined) updateData.toz = data.toz;
    if (data.sez !== undefined) updateData.sez = data.sez;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.reportId !== undefined) updateData.reportId = data.reportId;
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;

    // Handle JSON fields
    if (data.regulationResult !== undefined) {
      updateData.regulationResult = JSON.stringify(data.regulationResult);
    }
    if (data.gdcrClauses !== undefined) {
      updateData.gdcrClauses = JSON.stringify(data.gdcrClauses);
    }
    if (data.extractedData !== undefined) {
      updateData.extractedData = JSON.stringify(data.extractedData);
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    // Parse JSON fields for response and convert to app format
    const parsed = {
      ...project,
      regulationResult: project.regulationResult ? JSON.parse(project.regulationResult) : null,
      gdcrClauses: project.gdcrClauses ? JSON.parse(project.gdcrClauses) : [],
      extractedData: project.extractedData ? JSON.parse(project.extractedData) : null,
    };

    return NextResponse.json({ project: dbProjectToAppProject(parsed) });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Failed to update project. Please check your input and try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { id } = await params;

    // Verify ownership
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project. Please try again later.' },
      { status: 500 }
    );
  }
}
