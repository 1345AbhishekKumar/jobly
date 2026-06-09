"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function initiateOAuth(provider: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const callbackUrl = new URL("/api/auth/callback", appUrl).toString();

  const client = await createInsforgeServer();
  const { data, error } = await client.auth.signInWithOAuth(provider, {
    redirectTo: callbackUrl,
    skipBrowserRedirect: true,
  });

  if (error || !data?.url || !data?.codeVerifier) {
    throw new Error(error?.message ?? "OAuth initialization failed");
  }

  const cookieStore = await cookies();
  cookieStore.set("insforge_code_verifier", data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  redirect(data.url);
}
