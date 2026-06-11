"use client";

import React from "react";

interface OtpVerificationFormProps {
  verificationCode: string;
  setVerificationCode: (v: string) => void;
  loading: boolean;
  resending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
}

export function OtpVerificationForm({
  verificationCode,
  setVerificationCode,
  loading,
  resending,
  onSubmit,
  onResend,
  onBack,
}: OtpVerificationFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="verification-code"
          className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1"
        >
          6-Digit OTP Code
        </label>
        <input
          id="verification-code"
          name="verificationCode"
          type="text"
          maxLength={6}
          required
          value={verificationCode}
          onChange={(e) =>
            setVerificationCode(e.target.value.replace(/\D/g, ""))
          }
          disabled={loading}
          placeholder="123456"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-center text-lg font-bold tracking-widest text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading || verificationCode.length !== 6}
        className="w-full flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-white hover:bg-accent-dark active:scale-[0.97] btn-interactive focus-ring shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Verifying code...
          </span>
        ) : (
          "Verify & Sign In"
        )}
      </button>

      <div className="flex flex-col items-center gap-2 mt-4 text-sm">
        <button
          type="button"
          onClick={onResend}
          disabled={resending || loading}
          className="font-semibold text-accent hover:text-accent-dark disabled:opacity-50"
        >
          {resending ? "Resending..." : "Resend verification code"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="text-text-secondary hover:text-text-primary"
        >
          Back to Sign Up
        </button>
      </div>
    </form>
  );
}
