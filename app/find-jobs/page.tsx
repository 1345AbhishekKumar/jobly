import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FindJobsClient } from "@/components/find-jobs/FindJobsClient";

export default async function FindJobsPage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login?redirectTo=/find-jobs");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-[1440px] px-6 py-8 space-y-8 animate-hero-fade">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-text-primary tracking-tight font-display">
            Find Jobs
          </h1>
          <p className="text-sm text-text-secondary">
            Discover and score relevant roles against your profile using automated agent searches.
          </p>
        </div>

        {/* Find Jobs Client (Interactive UI with Mock Data) */}
        <FindJobsClient />
      </main>

      <Footer />
    </div>
  );
}
