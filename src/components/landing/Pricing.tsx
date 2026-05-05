import { motion } from "framer-motion";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Studio",
    price: "$2,500",
    cadence: "/ month",
    tagline: "Fractional Design Team for early-stage developers.",
    features: [
      "4 hero stills per month",
      "5-day turnaround SLA",
      "1 active project at a time",
      "2 revision rounds included",
      "Slack channel + weekly review",
    ],
    cta: "Start Studio",
    featured: false,
  },
  {
    name: "Scale",
    price: "$6,500",
    cadence: "/ month",
    tagline: "For developers running parallel campaigns.",
    features: [
      "12 hero stills + 1 reel / month",
      "72-hour turnaround SLA",
      "3 active projects in parallel",
      "Unlimited revisions",
      "Dedicated PM + senior artist",
      "AI variants for finish packages",
    ],
    cta: "Start Scale",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    tagline: "Embedded with architecture firms shipping at scale.",
    features: [
      "Unlimited deliverables",
      "Same-day SLA on critical assets",
      "On-site / hybrid integration",
      "Custom AI tooling for your pipeline",
      "Quarterly visual strategy",
    ],
    cta: "Talk to founders",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">
            Design Subscription
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[1.05]">
            Productized pricing. <span className="italic">No more quotes.</span>
          </h2>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
            A monthly retainer for a fractional 8K visualization team. Predictable cost, predictable
            output — cancel any month.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                t.featured
                  ? "bg-primary text-primary-foreground shadow-luxe"
                  : "glass text-foreground"
              }`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.2em] rounded-full px-3 py-1">
                  Most chosen
                </div>
              )}
              <div className="font-display text-2xl">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <div className="font-display text-5xl">{t.price}</div>
                <div className={`text-sm ${t.featured ? "opacity-70" : "text-foreground/55"}`}>
                  {t.cadence}
                </div>
              </div>
              <p className={`mt-3 text-sm ${t.featured ? "opacity-80" : "text-foreground/70"}`}>
                {t.tagline}
              </p>

              <ul className="mt-7 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check className={`h-4 w-4 shrink-0 mt-0.5 ${t.featured ? "text-accent" : "text-walnut"}`} />
                    <span className={t.featured ? "opacity-90" : "text-foreground/80"}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-9 inline-flex justify-center rounded-full px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 ${
                  t.featured
                    ? "bg-cream text-walnut"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {t.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
