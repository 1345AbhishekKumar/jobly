import { createClient } from "@insforge/sdk";

const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});

async function main() {
  console.log("Querying profiles...");
  const { data: profiles, error } = await client.database
    .from("profiles")
    .select("*")
    .limit(10);
    
  if (error) {
    console.error("Query failed:", error);
  } else {
    console.log("Profiles found:", profiles?.length);
    console.log(JSON.stringify(profiles, null, 2));
  }
}

main();
