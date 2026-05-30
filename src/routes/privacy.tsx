import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";

const TITLE = "Privacy Policy — DBros Studio";
const DESCRIPTION = "Privacy Policy for DBros Studio. Learn how we collect, use and protect your personal data when you use our 3D interior design and architectural visualization services.";
const SITE_URL = "https://dbros.com";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/privacy` },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
            DBros<span className="text-accent">.</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-accent" />
            <span className="text-xs uppercase tracking-[0.22em] text-accent font-medium">
              Legal
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-[1.05]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-foreground/60">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 space-y-12 text-foreground/80 leading-relaxed"
        >
          <Section title="1. Introduction">
            DBros Studio ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and safeguard your information when you visit our website or use our 3D interior design and architectural visualization services.
          </Section>

          <Section title="2. Information We Collect">
            <p>We may collect the following types of personal information:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li><strong>Contact Information:</strong> Name, email address, phone number, and country when you book a consultation or contact us.</li>
              <li><strong>Project Details:</strong> Information about your project type, budget range, and specific requirements.</li>
              <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on pages, and other diagnostic data.</li>
              <li><strong>Communication Data:</strong> Records of correspondence, including emails and messages.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use your personal data for the following purposes:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li>To provide and manage our 3D visualization and interior design services.</li>
              <li>To schedule and conduct consultation meetings via Google Calendar and Google Meet.</li>
              <li>To communicate with you about your project, quotes, and deliverables.</li>
              <li>To improve our website, services, and customer experience.</li>
              <li>To comply with legal obligations and protect our rights.</li>
            </ul>
          </Section>

          <Section title="4. Google Services Integration">
            <p>
              Our booking system integrates with Google Calendar and Google Meet to schedule consultations. When you book a meeting, we create a calendar event and generate a Google Meet link. This process requires us to access Google Calendar APIs on behalf of our admin account. We do not access your personal Google account data.
            </p>
          </Section>

          <Section title="5. Data Sharing and Third Parties">
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your data with trusted service providers who assist us in operating our website and conducting our business, subject to strict confidentiality obligations. These include:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li>Google (for calendar events and video conferencing)</li>
              <li>Our backend infrastructure providers</li>
              <li>Analytics services to improve user experience</li>
            </ul>
          </Section>

          <Section title="6. Data Security">
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption in transit, secure server environments, and access controls.
            </p>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements. Booking data is retained for a minimum of 2 years to maintain records of consultations and project history.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li>Right to access the personal data we hold about you.</li>
              <li>Right to request correction of inaccurate or incomplete data.</li>
              <li>Right to request deletion of your personal data.</li>
              <li>Right to object to or restrict processing of your data.</li>
              <li>Right to data portability.</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us at{" "}
              <a href="mailto:hello@dbros.com" className="text-accent underline underline-offset-2">hello@dbros.com</a>.
            </p>
          </Section>

          <Section title="9. Cookies and Tracking">
            <p>
              Our website may use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie preferences through your browser settings.
            </p>
          </Section>

          <Section title="10. International Data Transfers">
            <p>
              DBros Studio operates globally, serving clients in the United States, United Kingdom, Australia, Canada, and the UAE. Your personal data may be transferred to and processed in countries other than your country of residence, where data protection laws may differ.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-4 glass rounded-2xl p-6">
              <p className="font-medium text-foreground">DBros Studio</p>
              <p className="mt-1 text-sm text-foreground/70">
                Email:{" "}
                <a href="mailto:hello@dbros.com" className="text-accent underline underline-offset-2">
                  hello@dbros.com
                </a>
              </p>
            </div>
          </Section>
        </motion.article>
      </div>

      {/* Footer link bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-foreground/50">
          <div>© {new Date().getFullYear()} DBros Studio · 3D Interior Visualization</div>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-foreground mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
