import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";

const TITLE = "Terms & Conditions — DBros Studio";
const DESCRIPTION = "Terms and Conditions for DBros Studio. Read our service terms, payment policies, intellectual property rights, and liability disclaimers for 3D interior design and architectural visualization services.";
const SITE_URL = "https://dbros.com";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/terms` },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/terms` }],
  }),
  component: TermsPage,
});

function TermsPage() {
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
            <FileText className="h-6 w-6 text-accent" />
            <span className="text-xs uppercase tracking-[0.22em] text-accent font-medium">
              Legal
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-[1.05]">
            Terms & Conditions
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
          <Section title="1. Acceptance of Terms">
            By accessing or using the DBros Studio website (dbros.com) and our 3D interior design, architectural visualization, and rendering services, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.
          </Section>

          <Section title="2. Services Description">
            <p>DBros Studio provides the following services:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li>3D interior design visualization and rendering.</li>
              <li>Architectural visualization for residential, commercial, and hospitality projects.</li>
              <li>8K photorealistic rendering services.</li>
              <li>AI-assisted interior style transformation and design exploration.</li>
              <li>Consultation and strategy calls via Google Meet.</li>
            </ul>
            <p className="mt-3">
              All services are provided on a project or subscription basis as agreed in writing between DBros Studio and the client.
            </p>
          </Section>

          <Section title="3. Booking and Consultations">
            <p>
              Our consultation booking system uses Google Calendar and Google Meet. By booking a consultation, you agree to receive calendar invitations and meeting links at the email address you provide. You are responsible for ensuring your contact details are accurate.
            </p>
            <p className="mt-3">
              We reserve the right to reschedule or cancel consultations with reasonable notice. Repeated no-shows may result in restriction from future bookings.
            </p>
          </Section>

          <Section title="4. Intellectual Property">
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li>All 3D renders, visualizations, and designs created by DBros Studio remain our intellectual property until full payment is received and rights are explicitly transferred.</li>
              <li>Upon full payment, clients receive a non-exclusive, royalty-free license to use the deliverables for the agreed purpose (e.g., marketing, pre-sales, investor presentations).</li>
              <li>DBros Studio retains the right to use anonymized or watermarked versions of the work for portfolio, marketing, and award submission purposes, unless a strict NDA is agreed upon in writing.</li>
              <li>Source files (Blender scenes, textures, 3D models) are not included in standard deliverables unless explicitly stated in the project agreement.</li>
            </ul>
          </Section>

          <Section title="5. Payments and Refunds">
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li>Subscription services are billed in advance according to the selected plan.</li>
              <li>Project-based work requires a deposit (typically 50%) before work begins, with the balance due upon delivery.</li>
              <li>Refunds are evaluated on a case-by-case basis. Deposits are generally non-refundable once work has commenced.</li>
              <li>Late payments may result in project delays or withholding of deliverables.</li>
            </ul>
          </Section>

          <Section title="6. Client Responsibilities">
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li>Clients must provide accurate project briefs, reference materials, and feedback in a timely manner.</li>
              <li>Delays caused by late client feedback or missing assets may extend delivery timelines.</li>
              <li>Clients warrant that they own or have licensed all materials (floor plans, CAD files, mood boards) provided to DBros Studio and that such use does not infringe third-party rights.</li>
            </ul>
          </Section>

          <Section title="7. Revisions and Approval">
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li>Standard projects include a defined number of revision rounds as stated in the project agreement.</li>
              <li>Additional revisions beyond the agreed scope may incur extra charges.</li>
              <li>Major scope changes (e.g., layout alterations after initial approval) are treated as new work and billed separately.</li>
            </ul>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, DBros Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to our services. Our total liability for any claim shall not exceed the amount paid by the client for the specific project or service giving rise to the claim.
            </p>
          </Section>

          <Section title="9. Confidentiality">
            <p>
              We treat all client information and project details as confidential. We will not disclose confidential information to third parties except as necessary to provide our services or as required by law.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              Either party may terminate a project or subscription with written notice. Upon termination, the client is responsible for payment of all work completed up to the termination date. Any deposits for unstarted work may be refunded at our discretion.
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p>
              These Terms & Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which DBros Studio is primarily registered, without regard to conflict of law principles. Any disputes shall be resolved through good-faith negotiation or, if necessary, binding arbitration.
            </p>
          </Section>

          <Section title="12. Changes to These Terms">
            <p>
              We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting to this page. Continued use of our services after changes constitutes acceptance of the updated terms.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>
              For questions about these Terms & Conditions, please contact us at:{" "}
              <a href="mailto:hello@dbros.com" className="text-accent underline underline-offset-2">
                hello@dbros.com
              </a>
            </p>
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
