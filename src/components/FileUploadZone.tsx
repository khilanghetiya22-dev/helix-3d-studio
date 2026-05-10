'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, File, Archive, Box, AlertCircle } from 'lucide-react';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, FILE_TYPE_CATEGORIES, ACCEPTED_FILE_TYPES_STRING } from '@/lib/constants';

interface FileWithPreview {
  file: File;
  id: string;
  progress: number;
  error?: string;
}

interface FileUploadZoneProps {
  files: FileWithPreview[];
  onFilesChange: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(fileName: string) {
  const ext = '.' + fileName.split('.').pop()?.toLowerCase();
  if (['.zip', '.rar'].includes(ext)) return <Archive className="w-5 h-5" />;
  if (['.stl', '.3mf', '.obj', '.ply', '.amf'].includes(ext)) return <Box className="w-5 h-5" />;
  if (['.gcode'].includes(ext)) return <FileText className="w-5 h-5" />;
  return <File className="w-5 h-5" />;
}

function getFileCategory(fileName: string): string {
  const ext = '.' + fileName.split('.').pop()?.toLowerCase();
  for (const [category, extensions] of Object.entries(FILE_TYPE_CATEGORIES)) {
    if (extensions.includes(ext)) return category;
  }
  return 'Other';
}

function validateFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPTED_FILE_TYPES.includes(ext as typeof ACCEPTED_FILE_TYPES[number])) {
    return `Unsupported file type: ${ext}`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`;
  }
  return null;
}

export default function FileUploadZone({
  files,
  onFilesChange,
  maxFiles = 20,
  disabled = false,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCountRef = useRef(0);

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const processed: FileWithPreview[] = fileArray.map((file) => {
      const error = validateFile(file);
      return {
        file,
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        progress: error ? 0 : 100,
        error: error || undefined,
      };
    });

    const total = files.length + processed.length;
    if (total > maxFiles) {
      const allowed = processed.slice(0, maxFiles - files.length);
      onFilesChange([...files, ...allowed]);
    } else {
      onFilesChange([...files, ...processed]);
    }
  }, [files, maxFiles, onFilesChange]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current += 1;
    if (dragCountRef.current === 1) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current -= 1;
    if (dragCountRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current = 0;
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [disabled, handleFiles]);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className="relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 group"
        style={{
          backgroundColor: isDragging ? 'rgba(201,146,10,0.05)' : '#1B2A4A',
          borderColor: isDragging ? '#C9920A' : 'rgba(201,146,10,0.25)',
          transform: isDragging ? 'scale(1.01)' : 'scale(1)',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES_STRING}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className={`transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
          <div
            className="mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
            style={{
              backgroundColor: isDragging ? 'rgba(201,146,10,0.15)' : 'rgba(201,146,10,0.08)',
              color: '#C9920A',
            }}
          >
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="text-base font-medium mb-1" style={{ color: '#F5F4F0' }}>
            {isDragging ? 'Drop files here' : 'Drag & drop your 3D files'}
          </h3>
          <p className="text-sm mb-3" style={{ color: '#9CA3AF' }}>
            or <span className="font-medium" style={{ color: '#C9920A' }}>browse from your computer</span>
          </p>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>
            STL, OBJ, STEP, F3D, SolidWorks, CATIA & more • Max {formatFileSize(MAX_FILE_SIZE)} per file
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); onFilesChange([]); }}
              className="text-xs transition-colors" style={{ color: '#C9920A' }}
            >
              Remove all
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 rounded-lg p-3 animate-scale-in"
                style={{
                  backgroundColor: f.error ? 'rgba(201,146,10,0.05)' : 'rgba(26,26,26,0.5)',
                  border: f.error ? '1px solid rgba(201,146,10,0.3)' : '1px solid rgba(201,146,10,0.1)',
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: f.error ? 'rgba(201,146,10,0.1)' : 'rgba(201,146,10,0.08)',
                    color: '#C9920A',
                  }}
                >
                  {f.error ? <AlertCircle className="w-5 h-5" /> : getFileIcon(f.file.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#F5F4F0' }}>
                    {f.file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs" style={{ color: '#6B6B6B' }}>{formatFileSize(f.file.size)}</span>
                    <span className="text-xs" style={{ color: '#6B6B6B' }}>•</span>
                    <span className="text-xs" style={{ color: '#6B6B6B' }}>{getFileCategory(f.file.name)}</span>
                  </div>
                  {f.error && (
                    <p className="text-xs mt-1" style={{ color: '#C9920A' }}>{f.error}</p>
                  )}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                  className="flex-shrink-0 p-1.5 rounded-lg transition-all"
                  style={{ color: '#6B6B6B' }}
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
