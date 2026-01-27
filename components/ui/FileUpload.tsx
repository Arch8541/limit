'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2, FileImage } from 'lucide-react';
import { Progress } from './Progress';

interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

interface FileUploadProps {
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
    'application/dwg': ['.dwg'],
  },
  maxSize = 10485760, // 10MB
  maxFiles = 5,
  onFilesSelected,
  className = '',
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        progress: 0,
        status: 'uploading' as const,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload progress
      newFiles.forEach((uploadedFile, index) => {
        const interval = setInterval(() => {
          setUploadedFiles((prev) => {
            const updated = [...prev];
            const fileIndex = prev.findIndex((f) => f.file === uploadedFile.file);
            if (fileIndex !== -1) {
              if (updated[fileIndex].progress >= 100) {
                updated[fileIndex].status = 'success';
                clearInterval(interval);
              } else {
                updated[fileIndex].progress += 10;
              }
            }
            return updated;
          });
        }, 100);
      });

      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
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
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              or click to browse (PDF, DWG, JPG, PNG up to {formatFileSize(maxSize)})
            </p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
          {uploadedFiles.map((uploadedFile, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-4 hover-lift transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-16 h-16 object-cover rounded-xl border border-stone-200"
                  />
                ) : (
                  <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                    {uploadedFile.file.type === 'application/pdf' ? (
                      <File className="w-8 h-8 text-teal-600" />
                    ) : (
                      <FileImage className="w-8 h-8 text-teal-600" />
                    )}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{uploadedFile.file.name}</p>
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
                    <div className="mt-2">
                      <Progress value={uploadedFile.progress} size="sm" />
                    </div>
                  )}

                  {uploadedFile.status === 'success' && (
                    <div className="mt-2 flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Upload complete</span>
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
