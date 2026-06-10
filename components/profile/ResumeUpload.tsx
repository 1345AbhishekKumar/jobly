"use client";

import React, { useRef, useState } from "react";
import { uploadResume } from "@/actions/profile";
import { extractProfileFromResume } from "@/actions/extract";

interface ResumeUploadProps {
  initialResumeUrl: string | null;
  onUploadSuccess: (url: string) => void;
  onExtractStart?: () => void;
  onExtractSuccess?: (data: any) => void;
  onExtractError?: (message: string) => void;
}

export function ResumeUpload({
  initialResumeUrl,
  onUploadSuccess,
  onExtractStart,
  onExtractSuccess,
  onExtractError,
}: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

  const handleExtract = async () => {
    setExtracting(true);
    setError(null);
    if (onExtractStart) onExtractStart();

    try {
      const result = await extractProfileFromResume();
      if (result.success && result.data) {
        if (onExtractSuccess) onExtractSuccess(result.data);
      } else {
        const errMsg = result.message || "Failed to extract profile details.";
        setError(errMsg);
        if (onExtractError) onExtractError(errMsg);
      }
    } catch (err: any) {
      const errMsg = err.message || "An unexpected error occurred during extraction.";
      setError(errMsg);
      if (onExtractError) onExtractError(errMsg);
    } finally {
      setExtracting(false);
    }
  };

  const getFileName = (url: string | null) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      const objectsPrefix = "/objects/";
      const objectsIndex = urlObj.pathname.indexOf(objectsPrefix);
      if (objectsIndex === -1) return "resume.pdf";
      const encodedKey = urlObj.pathname.substring(objectsIndex + objectsPrefix.length);
      const key = decodeURIComponent(encodedKey);
      return key.substring(key.lastIndexOf("/") + 1);
    } catch {
      return "resume.pdf";
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
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-success-lightest border border-success-light rounded-lg text-success-dark">
            <div className="flex items-center gap-2 min-w-0">
              <svg
                className="h-5 w-5 text-success flex-shrink-0"
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
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold">Resume uploaded successfully</span>
                <span className="text-[10px] text-success-dark/70 font-mono mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                  {getFileName(resumeUrl)}
                </span>
              </div>
            </div>
            <a
              href="/api/resume/download"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold underline hover:text-success-darker flex-shrink-0 ml-2"
            >
              View File
            </a>
          </div>

          <button
            type="button"
            onClick={handleExtract}
            disabled={extracting || uploading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-semibold text-white hover:bg-accent-dark active:scale-[0.98] btn-interactive focus-ring shadow-sm disabled:opacity-50"
          >
            {extracting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Extracting Profile details...
              </>
            ) : (
              <>
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
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                Extract from Resume
              </>
            )}
          </button>
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
