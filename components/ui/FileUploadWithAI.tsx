'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2, FileImage, Loader2, AlertCircle } from 'lucide-react';
import { Progress } from './Progress';
import { extractDrawingData, isSupportedFileType, getFileType, validateExtractedDimensions } from '@/lib/ai/drawing-extractor';
import { ExtractedDrawingData } from '@/types';
import { Input } from './Input';
import { Button } from './Button';

interface UploadedFile {
  file: File;
  preview?: string;
  status: 'uploading' | 'extracting' | 'success' | 'error' | 'verifying';
  progress: number;
  extractedData?: ExtractedDrawingData;
  error?: string;
}

interface FileUploadWithAIProps {
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  onExtractionComplete: (data: ExtractedDrawingData) => void;
  className?: string;
}

export function FileUploadWithAI({
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
    'application/dwg': ['.dwg'],
  },
  maxSize = 10485760, // 10MB
  maxFiles = 1, // Only 1 file for drawing extraction
  onExtractionComplete,
  className = '',
}: FileUploadWithAIProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [correctedDimensions, setCorrectedDimensions] = useState<{
    length?: number;
    width?: number;
  }>({});

  const processFile = async (file: File) => {
    const fileType = getFileType(file);
    if (!fileType || !isSupportedFileType(file)) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, status: 'error', error: 'Unsupported file type' }
            : f
        )
      );
      return;
    }

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.file === file && f.progress < 100) {
            return { ...f, progress: Math.min(f.progress + 20, 100) };
          }
          return f;
        })
      );
    }, 100);

    setTimeout(async () => {
      clearInterval(uploadInterval);

      // Start AI extraction
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.file === file ? { ...f, status: 'extracting', progress: 100 } : f
        )
      );

      const result = await extractDrawingData({ file, type: fileType });

      if (result.success && result.data) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? { ...f, status: 'verifying', extractedData: result.data }
              : f
          )
        );
      } else {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? { ...f, status: 'error', error: result.error || 'Extraction failed' }
              : f
          )
        );
      }
    }, 500);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        progress: 0,
        status: 'uploading' as const,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Process each file
      newFiles.forEach((uploadedFile) => {
        processFile(uploadedFile.file);
      });
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: maxFiles - uploadedFiles.length,
  });

  const removeFile = (fileToRemove: UploadedFile) => {
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setUploadedFiles((prev) => prev.filter((f) => f.file !== fileToRemove.file));
    setCorrectedDimensions({});
  };

  const confirmExtraction = (uploadedFile: UploadedFile) => {
    if (!uploadedFile.extractedData) return;

    const finalData = validateExtractedDimensions(
      uploadedFile.extractedData.plotDimensions,
      correctedDimensions
    );

    const confirmedData: ExtractedDrawingData = {
      ...uploadedFile.extractedData,
      plotDimensions: finalData,
      confidence: correctedDimensions.length || correctedDimensions.width
        ? 100 // User corrected, so 100% confidence
        : uploadedFile.extractedData.confidence,
      method: correctedDimensions.length || correctedDimensions.width ? 'manual' : 'ai',
    };

    setUploadedFiles((prev) =>
      prev.map((f) => (f.file === uploadedFile.file ? { ...f, status: 'success' } : f))
    );

    onExtractionComplete(confirmedData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {uploadedFiles.length === 0 && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer
            transition-all duration-300 smooth-transition
            ${
              isDragActive
                ? 'border-teal-500 bg-teal-50/50 scale-105'
                : 'border-stone-300 hover:border-teal-400 hover:bg-stone-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              ${isDragActive ? 'bg-teal-600 scale-110' : 'bg-teal-100'}
              transition-all duration-300
            `}
            >
              <Upload className={`w-8 h-8 ${isDragActive ? 'text-white' : 'text-teal-600'}`} />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {isDragActive ? 'Drop your drawing here' : 'Upload Drawing for AI Extraction'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                or click to browse (PDF, DWG, JPG, PNG up to {formatFileSize(maxSize)})
              </p>
              <p className="text-xs text-teal-600 mt-2 font-medium">
                AI will automatically extract plot dimensions
              </p>
            </div>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          {uploadedFiles.map((uploadedFile, index) => (
            <div key={index} className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-20 h-20 object-cover rounded-xl border border-stone-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-teal-100 rounded-xl flex items-center justify-center">
                    {uploadedFile.file.type === 'application/pdf' ? (
                      <File className="w-10 h-10 text-teal-600" />
                    ) : (
                      <FileImage className="w-10 h-10 text-teal-600" />
                    )}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{uploadedFile.file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(uploadedFile.file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(uploadedFile)}
                      className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>

                  {uploadedFile.status === 'uploading' && (
                    <div className="mt-3">
                      <Progress value={uploadedFile.progress} size="sm" />
                      <p className="text-sm text-gray-600 mt-1">Uploading...</p>
                    </div>
                  )}

                  {uploadedFile.status === 'extracting' && (
                    <div className="mt-3 flex items-center gap-2 text-teal-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">AI is analyzing the drawing...</span>
                    </div>
                  )}

                  {uploadedFile.status === 'verifying' && uploadedFile.extractedData && (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start gap-2 text-amber-600 bg-amber-50 rounded-xl p-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold">Please verify extracted dimensions</p>
                          <p className="text-amber-700 mt-1">
                            Confidence: {uploadedFile.extractedData.confidence.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Plot Length (m)
                          </label>
                          <Input
                            type="number"
                            step="0.1"
                            defaultValue={uploadedFile.extractedData.plotDimensions.length}
                            onChange={(e) =>
                              setCorrectedDimensions((prev) => ({
                                ...prev,
                                length: parseFloat(e.target.value),
                              }))
                            }
                            placeholder="Length"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Plot Width (m)
                          </label>
                          <Input
                            type="number"
                            step="0.1"
                            defaultValue={uploadedFile.extractedData.plotDimensions.width}
                            onChange={(e) =>
                              setCorrectedDimensions((prev) => ({
                                ...prev,
                                width: parseFloat(e.target.value),
                              }))
                            }
                            placeholder="Width"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => confirmExtraction(uploadedFile)}
                          className="flex-1"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Confirm & Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  {uploadedFile.status === 'success' && (
                    <div className="mt-3 flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Extraction complete</span>
                    </div>
                  )}

                  {uploadedFile.status === 'error' && (
                    <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{uploadedFile.error}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
