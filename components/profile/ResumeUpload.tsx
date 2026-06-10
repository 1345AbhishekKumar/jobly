"use client";

import React, { useRef, useState } from "react";
import { uploadResume } from "@/actions/profile";

interface ResumeUploadProps {
  initialResumeUrl: string | null;
  onUploadSuccess: (url: string) => void;
}

export function ResumeUpload({
  initialResumeUrl,
  onUploadSuccess,
}: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(initialResumeUrl);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const result = await uploadResume(formData);
      if (result.success && result.url) {
        setResumeUrl(result.url);
        onUploadSuccess(result.url);
      } else {
        setError(result.message || "Failed to upload resume.");
      }
    } catch (err) {
      setError("An unexpected error occurred during upload.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary font-display">
          Resume
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
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
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        <div className="p-3 bg-accent-muted rounded-full text-accent mb-4">
          {uploading ? (
            <svg
              className="animate-spin h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          )}
        </div>

        <p className="text-sm font-semibold text-text-primary">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-text-muted mt-1">
          PDF formatting only. Maximum file size 5MB.
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerFileInput();
          }}
          disabled={uploading}
          className="mt-4 inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-secondary active:scale-[0.98] btn-interactive focus-ring shadow-sm"
        >
          Select Resume
        </button>
      </div>

      {error && <p className="text-xs font-medium text-error">{error}</p>}

      {resumeUrl && (
        <div className="flex items-center justify-between p-3 bg-success-lightest border border-success-light rounded-lg text-success-dark">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-semibold">Resume uploaded successfully</span>
          </div>
          <a
            href="/api/resume/download"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold underline hover:text-success-darker"
          >
            View File
          </a>
        </div>
      )}

      {/* Fresh Document Generation Option */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-4">
        <p className="text-xs text-text-secondary text-center sm:text-left">
          Need a fresh document based on the fields below?
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-accent text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-accent-dark active:scale-[0.98] btn-interactive focus-ring shadow-sm"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Generate Resume from Profile
        </button>
      </div>
    </div>
  );
}
