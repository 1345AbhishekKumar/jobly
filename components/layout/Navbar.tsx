import Image from "next/image";
import Link from "next/link";
import { createInsforgeServer } from "@/lib/insforge-server";
import { SignOutButton } from "@/components/auth/SignOutButton";

export async function Navbar() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-surface px-6">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="JobPilot Logo"
            width={36}
            height={36}
            className="object-cover rounded-[10px]"
            priority
          />
          <span className="text-[19px] font-bold leading-7 text-text-darkest font-display">
            JobPilot
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-text-dark hover:text-accent nav-link-underline focus-ring rounded px-1 py-1"
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className="text-sm font-medium text-text-dark hover:text-accent nav-link-underline focus-ring rounded px-1 py-1"
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-text-dark hover:text-accent nav-link-underline focus-ring rounded px-1 py-1"
          >
            Profile
          </Link>
        </nav>

        {/* CTA or Auth State */}
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-xs text-text-secondary">
                {user.email}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-text-darkest px-4 text-sm font-medium text-white hover:bg-opacity-90 active:scale-[0.97] btn-interactive focus-ring shadow-sm"
            >
              Start for free
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

