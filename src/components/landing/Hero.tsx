import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "@/assets/hero-interior.jpg";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src={heroImg}
          alt="Luxury interior architectural render"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-7xl px-6 pt-40 md:pt-56 pb-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-foreground/80 mb-8">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            3D Interior Visualization Studio
          </div>

          <h1 className="font-display text-[clamp(2.6rem,7vw,5.6rem)] leading-[1.02] font-medium text-foreground">
            The Action Layer for{" "}
            <span className="italic text-walnut">US Real Estate:</span>
            <br />
            From Blueprints to{" "}
            <span className="relative">
              8K Reality.
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-accent/70 rounded-full" />
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg md:text-xl text-foreground/75 leading-relaxed">
            DBros is the visualization infrastructure trusted by elite US developers and architects to
            pre-sell properties, raise capital, and ship projects faster — at uncompromising 8K quality.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              See the Elite 12
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#ai-studio"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 text-sm font-medium text-foreground hover:bg-card transition-colors"
            >
              Try the AI Transformer
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            ["400+", "engineering hours saved"],
            ["$4.2M", "pre-construction sales unlocked"],
            ["60+", "luxury projects shipped"],
            ["8K", "render fidelity, every time"],
          ].map(([n, l]) => (
            <div key={l} className="glass rounded-2xl p-5">
              <div className="font-display text-3xl md:text-4xl text-foreground">{n}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-foreground/60">{l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
