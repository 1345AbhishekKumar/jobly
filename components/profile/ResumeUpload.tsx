"use client";

import React, { useState } from "react";
import { uploadResume } from "@/actions/profile";
import { extractProfileFromResume } from "@/actions/extract";
import { Profile } from "@/types";
import { ResumeUploadZone } from "./ResumeUploadZone";
import { ResumeSuccessBanner } from "./ResumeSuccessBanner";

interface ResumeUploadProps {
  initialResumeUrl: string | null;
  onUploadSuccess: (url: string) => void;
  onExtractStart?: () => void;
  onExtractSuccess?: (data: Partial<Profile>) => void;
  onExtractError?: (message: string) => void;
}

export function ResumeUpload({
  initialResumeUrl,
  onUploadSuccess,
  onExtractStart,
  onExtractSuccess,
  onExtractError,
}: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(initialResumeUrl);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") { setError("Please upload a PDF file only."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("File is too large. Maximum size is 5MB."); return; }

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
    } catch {
      setError("An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) await processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) await processFile(e.target.files[0]);
  };

  const handleExtract = async () => {
    setExtracting(true);
    setError(null);
    onExtractStart?.();
    try {
      const result = await extractProfileFromResume();
      if (result.success && result.data) {
        onExtractSuccess?.(result.data);
      } else {
        const msg = result.message || "Failed to extract profile details.";
        setError(msg);
        onExtractError?.(msg);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during extraction.";
      setError(msg);
      onExtractError?.(msg);
    } finally {
      setExtracting(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/resume/generate", { method: "POST" });
      const result = await res.json();
      if (res.ok && result.success && result.url) {
        setResumeUrl(result.url);
        onUploadSuccess(result.url);
      } else {
        setError(result.message || "Failed to generate resume.");
      }
    } catch {
      setError("An unexpected error occurred during resume generation.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary font-display">Resume</h3>
        <p className="text-xs text-text-secondary mt-1">
          Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
        </p>
      </div>

      <ResumeUploadZone
        dragActive={dragActive}
        uploading={uploading}
        onDrag={handleDrag}
        onDrop={handleDrop}
        onFileChange={handleFileChange}
      />

      {error && <p className="text-xs font-medium text-error">{error}</p>}

      {resumeUrl && (
        <ResumeSuccessBanner
          resumeUrl={resumeUrl}
          extracting={extracting}
          uploading={uploading}
          onExtract={handleExtract}
        />
      )}

      {/* Generate from profile */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-4">
        <p className="text-xs text-text-secondary text-center sm:text-left">
          Need a fresh document based on the fields below?
        </p>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || uploading || extracting}
          className="inline-flex items-center gap-2 bg-accent text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-accent-dark active:scale-[0.98] btn-interactive focus-ring shadow-sm disabled:opacity-50"
        >
          {generating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Resume from Profile
            </>
          )}
        </button>
      </div>
    </div>
  );
}
