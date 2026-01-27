import { ExtractedDrawingData, PlotDimensions } from '@/types';

export interface DrawingFile {
  file: File;
  type: 'dwg' | 'pdf' | 'jpg' | 'png';
}

export interface ExtractionResult {
  success: boolean;
  data?: ExtractedDrawingData;
  error?: string;
}

// Mock AI extraction - simulates processing delay and returns plausible data
export async function extractDrawingData(
  drawingFile: DrawingFile
): Promise<ExtractionResult> {
  // Simulate processing delay (2-3 seconds)
  const delay = 2000 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    // Extract some info from filename for more realistic mock data
    const filename = drawingFile.file.name.toLowerCase();

    // Try to extract dimensions from filename patterns like "plot_20x30.pdf"
    const dimensionPattern = /(\d+)\s*[x×]\s*(\d+)/;
    const match = filename.match(dimensionPattern);

    let length: number;
    let width: number;

    if (match) {
      // Use dimensions from filename
      length = parseFloat(match[1]);
      width = parseFloat(match[2]);
    } else {
      // Generate realistic random plot dimensions (10-50 meters)
      length = Math.round((Math.random() * 40 + 10) * 10) / 10;
      width = Math.round((Math.random() * 40 + 10) * 10) / 10;
    }

    const area = Math.round(length * width * 100) / 100;

    const plotDimensions: PlotDimensions = {
      length,
      width,
      area,
    };

    // Mock confidence score (85-98%)
    const confidence = Math.round((Math.random() * 13 + 85) * 100) / 100;

    const extractedData: ExtractedDrawingData = {
      plotDimensions,
      confidence,
      method: 'ai',
      extractedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: extractedData,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to extract data from drawing',
    };
  }
}

// Validate and correct extracted dimensions
export function validateExtractedDimensions(
  dimensions: PlotDimensions,
  userCorrections?: Partial<PlotDimensions>
): PlotDimensions {
  const corrected = {
    ...dimensions,
    ...userCorrections,
  };

  // Recalculate area if length or width was corrected
  if (userCorrections?.length || userCorrections?.width) {
    corrected.area = Math.round(corrected.length * corrected.width * 100) / 100;
  }

  return corrected;
}

// Check if file type is supported
export function isSupportedFileType(file: File): boolean {
  const supportedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/acad',
    'application/x-acad',
    'application/autocad_dwg',
    'image/x-dwg',
  ];

  const supportedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.dwg'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

  return (
    supportedTypes.includes(file.type) ||
    supportedExtensions.includes(fileExtension)
  );
}

// Get file type from File object
export function getFileType(file: File): DrawingFile['type'] | null {
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

  switch (extension) {
    case '.dwg':
      return 'dwg';
    case '.pdf':
      return 'pdf';
    case '.jpg':
    case '.jpeg':
      return 'jpg';
    case '.png':
      return 'png';
    default:
      return null;
  }
}

// Placeholder for future real API integration
export async function extractWithOpenAIVision(
  drawingFile: DrawingFile
): Promise<ExtractionResult> {
  // TODO: Integrate with OpenAI Vision API or custom model
  // For now, fall back to mock extraction
  return extractDrawingData(drawingFile);
}

// Placeholder for future custom model integration
export async function extractWithCustomModel(
  drawingFile: DrawingFile
): Promise<ExtractionResult> {
  // TODO: Integrate with custom trained model
  // This would involve:
  // 1. Converting DWG/PDF to image if needed
  // 2. Preprocessing image (resize, normalize, etc.)
  // 3. Sending to custom model endpoint
  // 4. Parsing and validating model output
  // 5. Returning structured ExtractedDrawingData

  return extractDrawingData(drawingFile);
}
