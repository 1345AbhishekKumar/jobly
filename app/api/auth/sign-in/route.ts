import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { setAuthCookies } from "@insforge/sdk/ssr";

export async function POST(request: Request) {
  try {
    const client = await createInsforgeServer();
    const body = await request.json();
    const { data, error } = await client.auth.signInWithPassword(body);

    if (error || !data?.accessToken) {
      return NextResponse.json(
        {
          error: error?.error ?? "AUTH_UNAUTHORIZED",
          message: error?.message ?? "Sign in failed",
        },
        { status: error?.statusCode ?? 401 }
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
