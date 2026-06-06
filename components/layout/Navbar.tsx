import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-surface px-6">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-[10px]">
            <Image
              src="/logo.png"
              alt="JobPilot Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-[19px] font-bold leading-7 text-text-darkest">
            JobPilot
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-text-dark hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm transition-colors px-1"
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className="text-sm font-medium text-text-dark hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm transition-colors px-1"
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-text-dark hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm transition-colors px-1"
          >
            Profile
          </Link>
        </nav>

        {/* CTA */}
        <div>
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md bg-text-darkest px-4 text-sm font-medium text-white hover:bg-opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all"
          >
            Start for free
          </Link>
        </div>
      </div>
    </header>
  );
}
