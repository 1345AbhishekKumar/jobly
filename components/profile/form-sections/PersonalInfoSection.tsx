import React from "react";

interface PersonalInfoSectionProps {
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  phone: string;
  setPhone: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (val: string) => void;
  portfolioUrl: string;
  setPortfolioUrl: (val: string) => void;
  workAuthorization: string;
  setWorkAuthorization: (val: string) => void;
  disabled?: boolean;
}

export function PersonalInfoSection({
  fullName,
  setFullName,
  email,
  phone,
  setPhone,
  location,
  setLocation,
  linkedinUrl,
  setLinkedinUrl,
  portfolioUrl,
  setPortfolioUrl,
  workAuthorization,
  setWorkAuthorization,
  disabled = false,
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-text-primary border-b border-border pb-2 uppercase tracking-wide">
        Personal Info
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={disabled}
            placeholder="Faizan Ali"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Email
          </label>
          <input
            type="email"
            disabled
            value={email}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm font-medium text-text-secondary cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={disabled}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={disabled}
            placeholder="City, Country"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            disabled={disabled}
            placeholder="https://linkedin.com/in/username"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Portfolio / GitHub
          </label>
          <input
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            disabled={disabled}
            placeholder="https://github.com/username"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Work Authorization
          </label>
          <select
            value={workAuthorization}
            onChange={(e) => setWorkAuthorization(e.target.value)}
            disabled={disabled}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          >
            <option value="citizen">Citizen</option>
            <option value="permanent_resident">Permanent Resident</option>
            <option value="visa_required">Visa Required</option>
          </select>
        </div>
      </div>
    </div>
  );
}
