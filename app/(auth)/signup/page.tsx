"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initiateOAuth } from "@/actions/auth";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { SignupForm } from "@/components/auth/SignupForm";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200 flex gap-3">
      <svg className="h-5 w-5 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <p className="text-sm font-medium text-red-800">{message}</p>
    </div>
  );
}

function SuccessAlert({ message }: { message: string }) {
  return (
    <div className="mb-6 rounded-md bg-emerald-50 p-4 border border-emerald-200 flex gap-3">
      <svg className="h-5 w-5 text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <p className="text-sm font-medium text-emerald-800">{message}</p>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isActionPending = loading || isPending;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) { setError("Please fill in all fields."); return; }
    setError(null); setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create account.");
      if (data.requireEmailVerification) { setVerificationRequired(true); setLoading(false); }
      else { router.push("/dashboard"); router.refresh(); }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign up. Please try again.");
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) { setError("Please enter a valid 6-digit verification code."); return; }
    setError(null); setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid or expired verification code.");
      router.push("/dashboard"); router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true); setError(null); setResendSuccess(false);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Failed to resend code."); }
      setResendSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code. Please try again.");
    } finally { setResending(false); }
  };

  const handleOAuthSignIn = (provider: string) => {
    setError(null);
    startTransition(async () => {
      try { await initiateOAuth(provider); }
      catch (err: unknown) { setError(err instanceof Error ? err.message : `Failed to initialize ${provider} registration.`); }
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[440px] space-y-8">
        {/* Brand */}
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Image src="/logo.png" alt="Jobly Logo" width={40} height={40} className="object-cover rounded-[10px]" priority />
            <span className="text-2xl font-bold leading-7 text-text-darkest font-display">Jobly</span>
          </Link>
          <h2 className="text-3xl font-semibold text-text-primary tracking-tight font-display text-center">
            {verificationRequired ? "Verify your email" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-text-secondary text-center">
            {verificationRequired
              ? `We sent a 6-digit confirmation code to ${email}`
              : "Set up your profile once, let AI navigate your job search"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm sm:p-8">
          {error && <ErrorAlert message={error} />}
          {resendSuccess && <SuccessAlert message="Verification code resent successfully." />}

          {!verificationRequired ? (
            <>
              <OAuthButtons
                disabled={isActionPending}
                onGoogleClick={() => handleOAuthSignIn("google")}
                onGithubClick={() => handleOAuthSignIn("github")}
              />
              <SignupForm
                name={name} setName={setName}
                email={email} setEmail={setEmail}
                password={password} setPassword={setPassword}
                loading={isActionPending}
                onSubmit={handleSignup}
              />
            </>
          ) : (
            <OtpVerificationForm
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              loading={loading}
              resending={resending}
              onSubmit={handleVerifyCode}
              onResend={handleResendCode}
              onBack={() => { setVerificationRequired(false); setError(null); }}
            />
          )}
        </div>

        {!verificationRequired && (
          <p className="text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent hover:text-accent-dark focus-ring rounded px-1 py-0.5">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
