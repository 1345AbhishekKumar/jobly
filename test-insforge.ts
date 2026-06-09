import { createClient } from "@insforge/sdk";

console.log("INSFORGE URL:", process.env.NEXT_PUBLIC_INSFORGE_URL);
console.log("ANON KEY length:", process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY?.length);

const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});

async function main() {
  console.log("Initiating OAuth with google...");
  try {
    const { data, error } = await client.auth.signInWithOAuth("google", {
      redirectTo: "http://localhost:3000/api/auth/callback",
      skipBrowserRedirect: true,
    });
    if (error) {
      console.error("Error from InsForge SDK:", error);
    } else {
      console.log("Success! OAuth URL is:", data?.url);
    }
  } catch (err) {
    console.error("Caught exception:", err);
  }
}

main();
