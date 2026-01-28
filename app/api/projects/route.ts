import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';
import { dbProjectToAppProject } from '@/lib/db/converters';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const dbProjects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      // Select only needed fields for list view - improves performance
      select: {
        id: true,
        userId: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        authority: true,
        zone: true,
        plotLength: true,
        plotWidth: true,
        plotArea: true,
        isCornerPlot: true,
        roadWidthPrimary: true,
        roadWidthSecondary: true,
        intendedUse: true,
        heritage: true,
        toz: true,
        sez: true,
        status: true,
        reportId: true,
        thumbnail: true,
        regulationResult: true,
        gdcrClauses: true,
        extractedData: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Parse JSON fields
    const projectsWithParsedData = dbProjects.map(project => {
      const parsed = {
        ...project,
        regulationResult: project.regulationResult ? JSON.parse(project.regulationResult) : null,
        gdcrClauses: project.gdcrClauses ? JSON.parse(project.gdcrClauses) : [],
        extractedData: project.extractedData ? JSON.parse(project.extractedData) : null,
      };
      return dbProjectToAppProject(parsed);
    });

    return NextResponse.json({ projects: projectsWithParsedData });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects. Please try again later.' },
      { status: 500 }
    );
  }
}

// Validation schema for project creation
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200, 'Project name is too long'),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  authority: z.string().min(1, 'Authority is required'),
  zone: z.string().min(1, 'Zone is required'),
  plotLength: z.number().positive('Plot length must be positive'),
  plotWidth: z.number().positive('Plot width must be positive'),
  plotArea: z.number().positive('Plot area must be positive'),
  isCornerPlot: z.boolean().optional(),
  roadWidthPrimary: z.number().positive('Primary road width must be positive'),
  roadWidthSecondary: z.number().positive().optional(),
  intendedUse: z.string().min(1, 'Intended use is required'),
  heritage: z.boolean().optional(),
  toz: z.boolean().optional(),
  sez: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();

    // Validate input
    const validation = createProjectSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const data = validation.data;

    const project = await prisma.project.create({
      data: {
        userId,
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        authority: data.authority,
        zone: data.zone,
        plotLength: data.plotLength,
        plotWidth: data.plotWidth,
        plotArea: data.plotArea,
        isCornerPlot: data.isCornerPlot || false,
        roadWidthPrimary: data.roadWidthPrimary,
        roadWidthSecondary: data.roadWidthSecondary,
        intendedUse: data.intendedUse,
        heritage: data.heritage || false,
        toz: data.toz || false,
        sez: data.sez || false,
        status: 'draft',
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Failed to create project. Please check your input and try again.' },
      { status: 500 }
    );
  }
}
