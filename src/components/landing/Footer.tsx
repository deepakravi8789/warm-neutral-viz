import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative pt-28 md:pt-40 pb-12 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-5">
            Let's build the visual
          </div>
          <h2 className="font-display text-4xl md:text-7xl leading-[1.02]">
            Ready to ship your next project at <span className="italic">8K?</span>
          </h2>
          <p className="mt-7 text-lg text-background/70 max-w-2xl">
            Book a 30-minute strategy call. We'll review your portfolio, map a visual roadmap, and
            quote a subscription tier within 24 hours.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="mailto:hello@dbros.com"
              className="inline-flex items-center rounded-full bg-cream px-7 py-4 text-sm font-medium text-walnut hover:opacity-90 transition-opacity"
            >
              Book a Strategy Call →
            </a>
            <a
              href="mailto:hello@dbros.com"
              className="inline-flex items-center rounded-full border border-background/20 px-7 py-4 text-sm font-medium text-background hover:bg-background/10 transition-colors"
            >
              hello@dbros.com
            </a>
          </div>
        </motion.div>

        <div className="mt-24 pt-8 border-t border-background/15 flex flex-wrap items-center justify-between gap-4 text-xs text-background/60">
          <div className="font-display text-lg text-background">DBros<span className="text-accent">.</span></div>
          <div>© {new Date().getFullYear()} DBros Studio · 3D Interior Visualization</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-background">Instagram</a>
            <a href="#" className="hover:text-background">LinkedIn</a>
            <a href="#" className="hover:text-background">Behance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
