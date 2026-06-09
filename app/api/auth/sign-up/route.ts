import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { setAuthCookies } from "@insforge/sdk/ssr";

export async function POST(request: Request) {
  try {
    const client = await createInsforgeServer();
    const { email, password, name } = await request.json();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectTo = new URL("/login", appUrl).toString();

    const { data, error } = await client.auth.signUp({
      email,
      password,
      name,
      redirectTo,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error?.error ?? "AUTH_BAD_REQUEST",
          message: error?.message ?? "Sign up failed",
        },
        { status: error?.statusCode ?? 400 }
      );
    }

    const response = NextResponse.json({
      user: data?.user,
      requireEmailVerification: data?.requireEmailVerification,
    });

    if (data?.accessToken) {
      setAuthCookies(response.cookies, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    }

    return response;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "An error occurred";
    return NextResponse.json(
      { error: "SERVER_ERROR", message: errMsg },
      { status: 500 }
    );
  }
}
