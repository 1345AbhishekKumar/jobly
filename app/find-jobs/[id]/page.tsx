import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JobDetailsClient } from "@/components/job-details/JobDetailsClient";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect(`/login?redirectTo=/find-jobs/${id}`);
  }

  // Validate if the ID is a valid UUID to avoid PostgreSQL syntax casting errors (22P02)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isValidUuid = uuidRegex.test(id);

  let job = null;
  let jobError = null;

  if (isValidUuid) {
    const { data, error } = await insforge.database
      .from("jobs")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    job = data;
    jobError = error;
  }

  if (jobError || !job) {
    if (jobError) {
      console.error("[JobDetailsPage] Failed to fetch job:", id, jobError);
    }
    
    // Render a clean 404 state matching the design system
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 flex flex-col items-center justify-center max-w-[1440px] mx-auto w-full px-6 py-8 animate-hero-fade">
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-border bg-surface-secondary text-text-slate-medium shadow-sm mx-auto">
              <Building2 className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-text-primary tracking-tight font-display">
                Job Not Found
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                The job listing you are looking for does not exist or you do not have permission to view it.
              </p>
            </div>
            
            <Link
              href="/find-jobs"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark btn-interactive focus-ring shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Find Jobs
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  const formatDateServer = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const serializedJob = {
    ...job,
    formattedDateFound: formatDateServer(job.found_at || job.created_at),
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-[1440px] px-8 py-8">
        <JobDetailsClient job={serializedJob} />
      </main>

      <Footer />
    </div>
  );
}
