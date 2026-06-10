import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login?redirectTo=/profile");
  }

  // Fetch the user's profile from InsForge DB
  const { data: profile } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // If no profile exists yet, initialize a minimum object with user's email
  const initialProfile = profile || { email: user.email };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-[1440px] px-6 py-8 space-y-8 animate-hero-fade">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-text-primary tracking-tight font-display">
            Profile
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your personal details, resume, and preferences to customize your job search cockpit.
          </p>
        </div>

        {/* Profile Form (Client Component) */}
        <ProfileForm initialProfile={initialProfile} />
      </main>

      <Footer />
    </div>
  );
}
