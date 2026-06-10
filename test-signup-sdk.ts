import { createClient } from "@insforge/sdk";

const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});

async function main() {
  const email = "mefek53739@aspensif.com";
  console.log("Signing up with:", email);
  try {
    const { data, error } = await client.auth.signUp({
      email,
      password: "securePassword123",
      name: "Test User",
      redirectTo: "http://localhost:3000/login",
    });
    console.log("data:", JSON.stringify(data, null, 2));
    if (error) {
      console.log("error keys:", Object.keys(error));
      console.log("error JSON:", JSON.stringify(error, null, 2));
      const errDetails = error as any;
      console.log("error.statusCode:", errDetails.statusCode);
      console.log("error.status:", errDetails.status);
      console.log("error.error:", errDetails.error);
      console.log("error.message:", error.message);
    } else {
      console.log("Success!");
    }
  } catch (err) {
    console.error("Caught exception:", err);
  }
}

main();
