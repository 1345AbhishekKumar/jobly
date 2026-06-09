import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function POST() {
  try {
    const client = await createInsforgeServer();
    await client.auth.signOut();

    const response = NextResponse.json({ success: true });
    
    // Clear cookies
    response.cookies.delete("insforge_access_token");
    response.cookies.delete("insforge_refresh_token");

    return response;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "An error occurred";
    return NextResponse.json(
      { error: "SERVER_ERROR", message: errMsg },
      { status: 500 }
    );
  }
}
