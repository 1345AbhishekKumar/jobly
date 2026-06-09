import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface px-6 py-8 mt-auto">
      <div className="mx-auto flex max-w-[1440px] flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-[8px]">
            <Image
              src="/logo.png"
              alt="JobPilot Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-[16px] font-bold leading-6 text-text-darkest">
            JobPilot
          </span>
        </Link>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-text-secondary">
          <Link
            href="/dashboard"
            className="hover:text-accent focus-ring rounded-sm px-1 py-1"
          >
            Dashboard
          </Link>
          <Link
            href="/privacy"
            className="hover:text-accent focus-ring rounded-sm px-1 py-1"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-accent focus-ring rounded-sm px-1 py-1"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
