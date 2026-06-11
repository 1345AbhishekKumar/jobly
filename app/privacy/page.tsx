import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TableOfContents } from "@/components/legal/TableOfContents";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | JobPilot",
  description: "Learn how JobPilot collects, uses, and safeguards your personal data.",
};

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "information-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use-information", title: "3. How We Use Information" },
  { id: "data-sharing", title: "4. Sharing Your Information" },
  { id: "data-security", title: "5. Data Security & Storage" },
  { id: "your-rights", title: "6. Your Rights & Choices" },
  { id: "cookies-tracking", title: "7. Cookies & Tracking" },
  { id: "contact-us", title: "8. Contact Us" },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      {/* Header Banner */}
      <div className="w-full bg-surface border-b border-border py-12 px-6">
        <div className="mx-auto max-w-[1200px]">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Legal Center</span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-text-darkest font-display sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            Last updated: June 11, 2026 • Please read this policy carefully to understand how we handle your data.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Table of Contents - Hidden on mobile, sticky sidebar on desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 border border-border bg-surface p-5 rounded-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">
                On This Page
              </h3>
              <TableOfContents sections={sections} />
              <div className="mt-6 pt-6 border-t border-border">
                <span className="text-xs text-text-secondary block mb-2">Need help?</span>
                <Link
                  href="mailto:support@jobpilot.ai"
                  className="text-xs font-semibold text-accent hover:text-accent-dark transition-colors"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </aside>

          {/* Document Content */}
          <div className="col-span-1 lg:col-span-3">
            {/* Quick Links for Mobile Navigation */}
            <div className="lg:hidden mb-8 p-4 bg-surface border border-border rounded-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">
                Quick Jump
              </h3>
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-surface-secondary border border-border text-text-secondary hover:text-text-primary"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal Document Card */}
            <div className="bg-surface border border-border rounded-2xl p-6 md:p-10 shadow-sm">
              <div className="prose prose-slate max-w-[75ch] text-sm text-text-secondary leading-relaxed space-y-10">
                
                {/* Introduction Section */}
                <section id="introduction" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    1. Introduction
                  </h2>
                  <p>
                    Welcome to JobPilot ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our AI-powered job hunting assistant web application, hosted at our domain.
                  </p>
                  <p className="mt-3">
                    By accessing or using JobPilot, you agree to the collection and use of information in accordance with this policy. If you do not agree with any terms in this Privacy Policy, please discontinue use of our service immediately.
                  </p>
                </section>

                {/* Information We Collect Section */}
                <section id="information-we-collect" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    2. Information We Collect
                  </h2>
                  <p>
                    We collect personal information that you voluntarily provide to us when you register on our platform, build your profile, upload your resume, or perform company research.
                  </p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">A. Account Information</h3>
                      <p className="mt-1">
                        When you sign in using third-party providers (Google or GitHub OAuth), we retrieve your primary email address, full name, and profile picture url. This information is used to authenticate you and manage your session.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">B. Profile & Career Details</h3>
                      <p className="mt-1">
                        You may choose to provide contact details (phone number, location), professional details (years of experience, skills, industries), work history (past job titles, descriptions), education history, and job preferences.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">C. Resume Documents</h3>
                      <p className="mt-1">
                        If you upload a resume PDF, it is securely stored in our cloud database. We extract and process the text within the PDF to auto-fill your career profile and to run AI analysis for matching job listings.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">D. Log & Interaction Data</h3>
                      <p className="mt-1">
                        We automatically track specific user behaviors using analytical tools such as PostHog. This includes job searches started, jobs found, companies researched, page navigation, and general application usage metrics.
                      </p>
                    </div>
                  </div>
                </section>

                {/* How We Use Information Section */}
                <section id="how-we-use-information" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    3. How We Use Information
                  </h2>
                  <p>
                    We use the information we collect to operate, maintain, and provide the features of our AI-powered job assistant. Specifically, we use your data to:
                  </p>
                  <ul className="list-disc pl-5 mt-3 space-y-2">
                    <li>Generate and personalize your user dashboard and profile page.</li>
                    <li>Power our AI engines to read job descriptions, score matches, and summarize why a role fits your profile.</li>
                    <li>Enable the Company Research Agent to generate tailored company dossiers, tech stack outlines, culture breakdowns, and interview prep guides.</li>
                    <li>Create professional, generated resume PDFs based on your profile inputs.</li>
                    <li>Conduct analytics to monitor and improve system performance and user experience.</li>
                    <li>Provide customer support and respond to technical issues.</li>
                  </ul>
                </section>

                {/* Sharing Your Information Section */}
                <section id="data-sharing" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    4. Sharing Your Information
                  </h2>
                  <p>
                    We do not sell, rent, or trade your personal information to third parties. We only share information in the following limited circumstances:
                  </p>
                  <ul className="list-disc pl-5 mt-3 space-y-2">
                    <li>
                      <strong>Service Providers:</strong> We share data with third-party service providers (such as InsForge for backend services, database, and authentication; Browserbase for web scraping; PostHog for user analytics) to enable platform features.
                    </li>
                    <li>
                      <strong>AI Sub-processors:</strong> Your profile data and job details are processed by OpenAI API endpoints (such as GPT-4o) to evaluate match compatibility and compile dossiers. We ensure your personal data is protected and not used to train public LLM models.
                    </li>
                    <li>
                      <strong>Compliance with Laws:</strong> We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, or judicial proceedings.
                    </li>
                  </ul>
                </section>

                {/* Data Security & Storage Section */}
                <section id="data-security" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    5. Data Security & Storage
                  </h2>
                  <p>
                    Your account data, profile details, and jobs logs are saved in secure Postgres databases provided by InsForge, using industry-standard transport security (SSL/TLS). Raw PDF resumes are stored in specialized storage buckets with access controls restricted to authenticated users.
                  </p>
                  <p className="mt-3">
                    While we implement reasonable, standard security measures, please remember that no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                  </p>
                </section>

                {/* Your Rights & Choices Section */}
                <section id="your-rights" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    6. Your Rights & Choices
                  </h2>
                  <p>
                    Depending on your location, you may have certain statutory rights regarding your personal information. These generally include the right to:
                  </p>
                  <ul className="list-disc pl-5 mt-3 space-y-2">
                    <li>Access, review, and update your personal details directly on your Profile page.</li>
                    <li>Request the deletion of your account and all associated profile, resume, and job search records.</li>
                    <li>Object to the processing of your data or opt-out of analytics tracking.</li>
                  </ul>
                  <p className="mt-3">
                    To exercise any of these rights, please contact us using the details provided below. We will respond to your request within a reasonable timeframe.
                  </p>
                </section>

                {/* Cookies & Tracking Section */}
                <section id="cookies-tracking" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    7. Cookies & Tracking
                  </h2>
                  <p>
                    We use essential cookies and tokens to manage your sign-in session and keep you logged in. We also load analytics tracking scripts (PostHog) to understand user flows, click events, and application usage patterns. This helps us optimize performance and build features that solve real job-hunting pain points.
                  </p>
                  <p className="mt-3">
                    You can manage cookie settings in your web browser. However, disabling all cookies may prevent parts of the JobPilot application from functioning correctly.
                  </p>
                </section>

                {/* Contact Us Section */}
                <section id="contact-us" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    8. Contact Us
                  </h2>
                  <p>
                    If you have questions, comments, or concerns about this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-surface-secondary border border-border rounded-xl">
                    <p className="font-semibold text-text-primary">JobPilot Security & Privacy Team</p>
                    <p className="mt-1">Email: <Link href="mailto:privacy@jobpilot.ai" className="text-accent hover:underline">privacy@jobpilot.ai</Link></p>
                    <p>Address: 100 Innovation Way, Suite 400, San Francisco, CA 94107</p>
                  </div>
                </section>

              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
