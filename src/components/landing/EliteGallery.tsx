import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ELITE_12, type EliteProject } from "@/lib/gallery";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

const spanClass = (s: EliteProject["span"]) =>
  s === "tall" ? "md:row-span-2 aspect-[3/4]" : s === "wide" ? "md:col-span-2 aspect-[16/10]" : "aspect-square";

export function EliteGallery() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i! + 1) % ELITE_12.length);
      if (e.key === "ArrowLeft") setActive((i) => (i! - 1 + ELITE_12.length) % ELITE_12.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const project = active !== null ? ELITE_12[active] : null;

  return (
    <section id="work" className="relative py-28 md:py-40 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">
              The Elite 12
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[1.05] max-w-2xl">
              A selective archive. <span className="italic">Outcomes, not portfolios.</span>
            </h2>
          </motion.div>
          <p className="max-w-md text-foreground/70">
            Twelve projects, hand-picked from a 60+ archive. Every one shipped revenue, secured capital,
            or compressed a developer's timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-[280px] md:auto-rows-[320px]">
          {ELITE_12.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden rounded-2xl bg-muted text-left ${spanClass(p.span)}`}
            >
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-background">
                <div className="text-[11px] uppercase tracking-wider opacity-80">{p.location}</div>
                <div className="font-display text-xl mt-1">{p.title}</div>
              </div>
              <div className="absolute top-4 right-4 glass-dark rounded-full px-3 py-1 text-[11px] uppercase tracking-wider text-background opacity-0 group-hover:opacity-100 transition-opacity">
                View case study →
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {project && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-6xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full max-h-[85vh] object-contain rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 md:left-8 md:right-8 glass-dark rounded-2xl p-5 md:p-8 text-background">
                <div className="flex items-start justify-between gap-6 mb-5">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider opacity-70">{project.location}</div>
                    <div className="font-display text-2xl md:text-3xl mt-1">{project.title}</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-5 text-sm leading-relaxed">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-accent mb-1.5">The Challenge</div>
                    {project.challenge}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-accent mb-1.5">The Visual Strategy</div>
                    {project.strategy}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-accent mb-1.5">The Result</div>
                    {project.result}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute top-4 right-4 h-10 w-10 rounded-full glass-dark text-background grid place-items-center"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActive((i) => (i! - 1 + ELITE_12.length) % ELITE_12.length)}
                aria-label="Previous"
                className="absolute top-1/2 left-2 md:-left-14 -translate-y-1/2 h-11 w-11 rounded-full glass-dark text-background grid place-items-center"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActive((i) => (i! + 1) % ELITE_12.length)}
                aria-label="Next"
                className="absolute top-1/2 right-2 md:-right-14 -translate-y-1/2 h-11 w-11 rounded-full glass-dark text-background grid place-items-center"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
