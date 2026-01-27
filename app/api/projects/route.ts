import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { jwtVerify } from 'jose';
import { dbProjectToAppProject } from '@/lib/db/converters';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'limit-secret-key-change-in-production'
);

async function getUserFromToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

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
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
