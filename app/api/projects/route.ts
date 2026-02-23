import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';
import { dbProjectToAppProject } from '@/lib/db/converters';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/projects - Starting request');

    // Check environment
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const session = await auth();
    console.log('Session:', session ? 'authenticated' : 'not authenticated');

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    console.log('User ID:', userId);

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
        boundaryCoordinates: true,
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

    // Parse JSON fields and convert to app format
    const projectsWithParsedData = dbProjects.map(project => {
      const parsed = {
        ...project,
        boundaryCoordinates: project.boundaryCoordinates ? JSON.parse(project.boundaryCoordinates) : null,
        regulationResult: project.regulationResult ? JSON.parse(project.regulationResult) : null,
        gdcrClauses: project.gdcrClauses ? JSON.parse(project.gdcrClauses) : [],
        extractedData: project.extractedData ? JSON.parse(project.extractedData) : null,
      };
      return dbProjectToAppProject(parsed);
    });

    return NextResponse.json({ projects: projectsWithParsedData });
  } catch (error) {
    console.error('Get projects error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');

    // Return more specific error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch projects. Please try again later.', details: errorMessage },
      { status: 500 }
    );
  }
}

// Validation schema for project creation
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200, 'Project name is too long'),
  address: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  authority: z.string().min(1, 'Authority is required'),
  zone: z.string().min(1, 'Zone is required'),
  plotLength: z.number().positive('Plot length must be positive'),
  plotWidth: z.number().positive('Plot width must be positive'),
  plotArea: z.number().positive('Plot area must be positive'),
  boundaryCoordinates: z.array(z.object({
    x: z.number(),
    y: z.number()
  })).optional().nullable(),
  isCornerPlot: z.boolean().optional().default(false),
  roadWidthPrimary: z.number().positive('Primary road width must be positive'),
  roadWidthSecondary: z.number().positive().optional().nullable(),
  intendedUse: z.string().min(1, 'Intended use is required'),
  heritage: z.boolean().optional().default(false),
  toz: z.boolean().optional().default(false),
  sez: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/projects - Starting request');

    // Check environment
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const session = await auth();
    console.log('Session:', session ? 'authenticated' : 'not authenticated');

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    console.log('User ID:', userId);

    const body = await request.json();
    console.log('Received body keys:', Object.keys(body));

    // Validate input
    const validation = createProjectSchema.safeParse(body);
    if (!validation.success) {
      console.log('Validation errors:', JSON.stringify(validation.error.issues));
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid input', validationErrors: validation.error.issues },
        { status: 400 }
      );
    }
    console.log('Validation passed');

    const data = validation.data;

    console.log('Creating project in database...');
    const project = await prisma.project.create({
      data: {
        userId,
        name: data.name,
        address: data.address || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        authority: data.authority,
        zone: data.zone,
        plotLength: data.plotLength,
        plotWidth: data.plotWidth,
        plotArea: data.plotArea,
        boundaryCoordinates: data.boundaryCoordinates ? JSON.stringify(data.boundaryCoordinates) : null,
        isCornerPlot: data.isCornerPlot ?? false,
        roadWidthPrimary: data.roadWidthPrimary,
        roadWidthSecondary: data.roadWidthSecondary || null,
        intendedUse: data.intendedUse,
        heritage: data.heritage ?? false,
        toz: data.toz ?? false,
        sez: data.sez ?? false,
        status: 'draft',
      },
    });
    console.log('Project created:', project.id);

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');

    // Return more specific error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create project. Please check your input and try again.', details: errorMessage },
      { status: 500 }
    );
  }
}
