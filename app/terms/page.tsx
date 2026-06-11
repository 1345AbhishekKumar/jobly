import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TableOfContents } from "@/components/legal/TableOfContents";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Jobly",
  description: "Read the terms, rules, and conditions for using the Jobly platform.",
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "accounts", title: "2. Account Registration" },
  { id: "services", title: "3. Description of Services" },
  { id: "conduct", title: "4. User Code of Conduct" },
  { id: "ai-content", title: "5. AI Outputs & Limitations" },
  { id: "ip-rights", title: "6. Intellectual Property" },
  { id: "liability", title: "7. Limitation of Liability" },
  { id: "termination", title: "8. Termination of Services" },
  { id: "governing-law", title: "9. Governing Law" },
  { id: "contact", title: "10. Contact Information" },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      {/* Header Banner */}
      <div className="w-full bg-surface border-b border-border py-12 px-6">
        <div className="mx-auto max-w-[1200px]">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Legal Center</span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-text-darkest font-display sm:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            Last updated: June 11, 2026 • Please review these terms carefully before using our services.
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
                  href="mailto:support@jobly.ai"
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
                
                {/* Acceptance of Terms Section */}
                <section id="acceptance" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p>
                    By accessing or using the Jobly platform, web application, and associated services (collectively, the &quot;Services&quot;), you agree to be bound by these Terms &amp; Conditions (&quot;Terms&quot;) and our Privacy Policy. If you do not agree to all of these Terms, you are prohibited from using the Services.
                  </p>
                  <p className="mt-3">
                    We reserve the right, at our sole discretion, to change, modify, add, or remove portions of these Terms at any time. We will notify you of any changes by posting the updated Terms on this page. Your continued use of the Services following the posting of changes constitutes your acceptance of the revised Terms.
                  </p>
                </section>

                {/* Account Registration Section */}
                <section id="accounts" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    2. Account Registration
                  </h2>
                  <p>
                    To access the core features of Jobly, including the dashboard, profile builder, resume tailorer, and company research agent, you must sign in using a supported third-party identity provider (Google or GitHub OAuth).
                  </p>
                  <ul className="list-disc pl-5 mt-3 space-y-2">
                    <li>You agree to provide accurate, current, and complete profile information during registration.</li>
                    <li>You are responsible for maintaining the security of your authentication tokens and session credentials.</li>
                    <li>You must notify us immediately of any unauthorized use of your account or any other breach of security.</li>
                    <li>We cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.</li>
                  </ul>
                </section>

                {/* Description of Services Section */}
                <section id="services" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    3. Description of Services
                  </h2>
                  <p>
                    Jobly provides users with AI-driven tools to assist in job searches and application preparation. Features include:
                  </p>
                  <ul className="list-disc pl-5 mt-3 space-y-2">
                    <li><strong>Adzuna Job Discovery:</strong> Querying public API listings to find job matches based on user-entered titles and locations.</li>
                    <li><strong>AI Job Matching:</strong> Evaluation of job requirements against your user profile to produce match scores and summaries.</li>
                    <li><strong>Resume PDF Generation:</strong> Rendering formatting-compliant resume PDFs based on your profile inputs.</li>
                    <li><strong>Company Research Agent:</strong> Conducting automated research of employer websites via scraping tools to compile pre-interview preparation guides and tech stack dossiers.</li>
                  </ul>
                  <p className="mt-3">
                    We strive to keep the platform reliable, but we do not guarantee uninterrupted access. Features may be modified, suspended, or discontinued at any time without prior notice.
                  </p>
                </section>

                {/* User Code of Conduct Section */}
                <section id="conduct" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    4. User Code of Conduct
                  </h2>
                  <p>
                    You agree to use the Services only for lawful purposes and in accordance with these Terms. You agree not to:
                  </p>
                  <ul className="list-disc pl-5 mt-3 space-y-2">
                    <li>Use the Services to scrape, harvest, or collect job listings, company data, or other users&apos; profiles for commercial purposes outside personal job hunting.</li>
                    <li>Upload or submit resumes containing false credentials, deceptive work history, or fraudulent personal information.</li>
                    <li>Interfere with, disrupt, or attempt to gain unauthorized access to our servers, database clusters, or network integrations.</li>
                    <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                    <li>Use the Services for any automated activity that violates rate limits, puts undue load on our infrastructure, or aims to reverse-engineer our proprietary matching prompts.</li>
                  </ul>
                </section>

                {/* AI Outputs & Limitations Section */}
                <section id="ai-content" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    5. AI Outputs & Limitations
                  </h2>
                  <p>
                    Jobly utilizes large language models (such as GPT-4o) and web crawlers to generate matches, resume text, and company research dossiers.
                  </p>
                  <p className="mt-3 font-semibold text-text-primary">
                    Important Notice regarding AI Outputs:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>
                      AI-generated insights, resume suggestions, and dossiers are provided for informational and helper purposes only. We do not guarantee the absolute accuracy, completeness, or truthfulness of any generated content.
                    </li>
                    <li>
                      You are solely responsible for reviewing and editing all AI-generated resumes, cover letters, and email copy before submitting them to real employers. Jobly is not liable for inaccuracies, formatting errors, or embellishments introduced by AI models.
                    </li>
                    <li>
                      Job match scores are estimate approximations and do not guarantee an interview, hire, or specific hiring outcome.
                    </li>
                  </ul>
                </section>

                {/* Intellectual Property Section */}
                <section id="ip-rights" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    6. Intellectual Property
                  </h2>
                  <p>
                    The Jobly application interface, logo, code bases, designs, illustrations, database structures, and copywriting are the exclusive property of Jobly and its licensors, protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p className="mt-3">
                    We claim no ownership over the resume documents, text files, and profile details that you submit to the platform. You grant us a worldwide, non-exclusive, royalty-free license to store, parse, format, and share your submitted data with third-party sub-processors (like OpenAI and InsForge) strictly to the extent required to render the Services to you.
                  </p>
                </section>

                {/* Limitation of Liability Section */}
                <section id="liability" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    7. Limitation of Liability
                  </h2>
                  <p className="uppercase font-semibold text-xs text-text-primary tracking-wide">
                    Disclaimer of Warranties:
                  </p>
                  <p className="mt-1">
                    THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                  <p className="mt-3 uppercase font-semibold text-xs text-text-primary tracking-wide">
                    Limitation of Damages:
                  </p>
                  <p className="mt-1">
                    IN NO EVENT SHALL JOBLY, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES (INCLUDING DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICES.
                  </p>
                </section>

                {/* Termination of Services Section */}
                <section id="termination" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    8. Termination of Services
                  </h2>
                  <p>
                    We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation a breach of these Terms.
                  </p>
                  <p className="mt-3">
                    If you wish to terminate your account, you can simply cease using the Services, delete your data on the profile page, or contact our support team to permanently remove your records from our database.
                  </p>
                </section>

                {/* Governing Law Section */}
                <section id="governing-law" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    9. Governing Law
                  </h2>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
                  </p>
                  <p className="mt-3">
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                  </p>
                </section>

                {/* Contact Information Section */}
                <section id="contact" className="scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-text-primary border-b border-border pb-3 mb-4">
                    10. Contact Information
                  </h2>
                  <p>
                    If you have any questions about these Terms & Conditions, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-surface-secondary border border-border rounded-xl">
                    <p className="font-semibold text-text-primary">Jobly Legal Department</p>
                    <p className="mt-1">Email: <Link href="mailto:legal@jobly.ai" className="text-accent hover:underline">legal@jobly.ai</Link></p>
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
