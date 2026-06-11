"use client";

import React, { useRef } from "react";

interface ResumeUploadZoneProps {
  dragActive: boolean;
  uploading: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ResumeUploadZone({
  dragActive,
  uploading,
  onDrag,
  onDrop,
  onFileChange,
}: ResumeUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerInput = () => fileInputRef.current?.click();

  return (
    <div
      onDragEnter={onDrag}
      onDragOver={onDrag}
      onDragLeave={onDrag}
      onDrop={onDrop}
      onClick={triggerInput}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
        dragActive
          ? "border-accent bg-accent-muted"
          : "border-border-muted hover:border-accent hover:bg-surface-secondary"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={onFileChange}
        className="hidden"
        disabled={uploading}
      />

      <div className="p-3 bg-accent-muted rounded-full text-accent mb-4">
        {uploading ? (
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        )}
      </div>

      <p className="text-sm font-semibold text-text-primary">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-text-muted mt-1">PDF formatting only. Maximum file size 5MB.</p>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); triggerInput(); }}
        disabled={uploading}
        className="mt-4 inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-secondary active:scale-[0.98] btn-interactive focus-ring shadow-sm"
      >
        Select Resume
      </button>
    </div>
  );
}
