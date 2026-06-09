import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function POST(request: Request) {
  try {
    const client = await createInsforgeServer();
    const { email } = await request.json();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectTo = new URL("/login", appUrl).toString();

    const { error } = await client.auth.resendVerificationEmail({
      email,
      redirectTo,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error?.error ?? "AUTH_RESEND_FAILED",
          message: error?.message ?? "Failed to resend verification email.",
        },
        { status: error?.statusCode ?? 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "An error occurred";
    return NextResponse.json(
      { error: "SERVER_ERROR", message: errMsg },
      { status: 500 }
    );
  }
}
