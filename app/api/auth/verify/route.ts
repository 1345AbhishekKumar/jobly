import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { setAuthCookies } from "@insforge/sdk/ssr";

export async function POST(request: Request) {
  try {
    const client = await createInsforgeServer();
    const { email, otp } = await request.json();

    const { data, error } = await client.auth.verifyEmail({
      email,
      otp,
    });

    if (error || !data?.accessToken) {
      return NextResponse.json(
        {
          error: error?.error ?? "AUTH_VERIFICATION_FAILED",
          message: error?.message ?? "Verification failed",
        },
        { status: error?.statusCode ?? 400 }
      );
    }

    const response = NextResponse.json({ user: data.user });
    setAuthCookies(response.cookies, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return response;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "An error occurred";
    return NextResponse.json(
      { error: "SERVER_ERROR", message: errMsg },
      { status: 500 }
    );
  }
}
