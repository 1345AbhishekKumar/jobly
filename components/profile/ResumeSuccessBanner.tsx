import React from "react";

interface ResumeSuccessBannerProps {
  resumeUrl: string;
  extracting: boolean;
  uploading: boolean;
  onExtract: () => void;
}

function getFileName(url: string): string {
  try {
    const pathname = url.includes("://") ? new URL(url).pathname : url;
    const decoded = decodeURIComponent(pathname);
    const parts = decoded.split("/");
    return parts[parts.length - 1] || "resume.pdf";
  } catch {
    return "resume.pdf";
  }
}

export function ResumeSuccessBanner({
  resumeUrl,
  extracting,
  uploading,
  onExtract,
}: ResumeSuccessBannerProps) {
  return (
    <div className="space-y-3">
      {/* Uploaded File Badge */}
      <div className="flex items-center justify-between p-3 bg-success-lightest border border-success-light rounded-lg text-success-dark">
        <div className="flex items-center gap-2 min-w-0">
          <svg className="h-5 w-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold">Resume uploaded successfully</span>
            <span className="text-[10px] text-success-dark/70 font-mono mt-0.5 truncate max-w-[200px] sm:max-w-xs">
              {getFileName(resumeUrl)}
            </span>
          </div>
        </div>
        <a
          href={`/api/resume/download?t=${encodeURIComponent(resumeUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold underline hover:text-success-darker flex-shrink-0 ml-2"
        >
          View File
        </a>
      </div>

      {/* Extract Button */}
      <button
        type="button"
        onClick={onExtract}
        disabled={extracting || uploading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-semibold text-white hover:bg-accent-dark active:scale-[0.98] btn-interactive focus-ring shadow-sm disabled:opacity-50"
      >
        {extracting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Extracting Profile details...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Extract from Resume
          </>
        )}
      </button>
    </div>
  );
}
