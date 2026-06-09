"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-out", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to sign out");
      }

      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-text-primary hover:bg-surface-secondary active:scale-[0.97] btn-interactive focus-ring shadow-sm disabled:opacity-50"
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
