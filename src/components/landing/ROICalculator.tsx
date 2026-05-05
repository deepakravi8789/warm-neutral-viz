import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Sparkles } from "lucide-react";

const SIZES = [
  { id: "small", label: "Small", multiplier: 1, baseHours: 80, baseLift: 4, baseDays: 14 },
  { id: "medium", label: "Medium", multiplier: 2.4, baseHours: 200, baseLift: 8, baseDays: 28 },
  { id: "commercial", label: "Commercial", multiplier: 5.2, baseHours: 480, baseLift: 14, baseDays: 52 },
] as const;

const ASSETS = [
  { id: "residential", label: "Residential", weight: 1.0 },
  { id: "multifamily", label: "Multifamily", weight: 1.25 },
  { id: "hospitality", label: "Hospitality", weight: 1.4 },
] as const;

const MARKETS = [
  { id: "dallas", label: "Dallas", weight: 1.0 },
  { id: "miami", label: "Miami", weight: 1.15 },
  { id: "nyc", label: "NYC", weight: 1.3 },
  { id: "la", label: "Los Angeles", weight: 1.25 },
  { id: "austin", label: "Austin", weight: 1.05 },
] as const;

function useCounter(target: number, duration = 900) {
  const [v, setV] = useState(target);
  useEffect(() => {
    const start = performance.now();
    const from = v;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return v;
}

export function ROICalculator() {
  const [size, setSize] = useState<(typeof SIZES)[number]["id"]>("medium");
  const [asset, setAsset] = useState<(typeof ASSETS)[number]["id"]>("residential");
  const [market, setMarket] = useState<(typeof MARKETS)[number]["id"]>("dallas");

  const result = useMemo(() => {
    const s = SIZES.find((x) => x.id === size)!;
    const a = ASSETS.find((x) => x.id === asset)!;
    const m = MARKETS.find((x) => x.id === market)!;
    const lift = s.baseLift * a.weight * m.weight;
    const days = Math.round(s.baseDays * a.weight);
    const hours = Math.round(s.baseHours * a.weight);
    return { lift: +lift.toFixed(1), days, hours };
  }, [size, asset, market]);

  const lift = useCounter(result.lift);
  const days = useCounter(result.days);
  const hours = useCounter(result.hours);

  return (
    <section id="roi" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">
            AI Studio · Feature 02
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[1.05]">
            Instant <span className="italic">ROI Calculator</span>
          </h2>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
            Estimate the property-value lift, time-to-market reduction, and engineering hours saved when
            DBros joins your project.
          </p>
        </motion.div>

        <div className="mt-14 grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="glass rounded-3xl p-6 md:p-10 space-y-8">
            <Field label="Project size">
              <Pills value={size} onChange={setSize} options={SIZES.map((s) => ({ id: s.id, label: s.label }))} />
            </Field>
            <Field label="Asset type">
              <Pills value={asset} onChange={setAsset} options={ASSETS.map((s) => ({ id: s.id, label: s.label }))} />
            </Field>
            <Field label="Primary market">
              <Pills value={market} onChange={setMarket} options={MARKETS.map((s) => ({ id: s.id, label: s.label }))} />
            </Field>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            <ResultCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Estimated property value lift"
              value={`+${lift.toFixed(1)}%`}
              hint="vs. listings without 8K visualization"
              big
            />
            <ResultCard
              icon={<Clock className="h-5 w-5" />}
              label="Time-on-market reduction"
              value={`${Math.round(days)} days`}
              hint="median across DBros projects"
            />
            <ResultCard
              icon={<Sparkles className="h-5 w-5" />}
              label="Engineering hours saved"
              value={`${Math.round(hours)} hrs`}
              hint="redesign cycles replaced with renders"
            />
            <div className="glass rounded-2xl p-6 flex flex-col justify-between">
              <p className="text-sm text-foreground/70 leading-relaxed">
                Want a tailored projection with your project specs?
              </p>
              <a
                href="#contact"
                className="mt-4 inline-flex w-fit rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Get a personalized analysis →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-foreground/60 mb-3">{label}</div>
      {children}
    </div>
  );
}

function Pills<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-full px-4 py-2 text-sm transition-all ${
            value === o.id
              ? "bg-primary text-primary-foreground"
              : "bg-card/60 hover:bg-card text-foreground/80"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
  hint,
  big,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  big?: boolean;
}) {
  return (
    <div className={`glass rounded-2xl p-6 ${big ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-2 text-foreground/60 text-xs uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className={`mt-3 font-display ${big ? "text-6xl md:text-7xl" : "text-4xl"} text-foreground`}>{value}</div>
      <div className="mt-2 text-xs text-foreground/55">{hint}</div>
    </div>
  );
}
