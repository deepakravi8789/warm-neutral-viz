import { motion } from "framer-motion";
import { Layers, Cpu, LineChart } from "lucide-react";

const ITEMS = [
  {
    icon: Layers,
    title: "Selective by Design",
    body: "We don't list 60 projects on the homepage. Twelve case studies — every one shipped a measurable outcome. The archive is for due diligence, not noise.",
  },
  {
    icon: Cpu,
    title: "AI-Accelerated Pipeline",
    body: "AI handles the boring work — scene debugging, batch scripting in Blender, asset variants — so our artists spend their time on the 1% that decides a sale.",
  },
  {
    icon: LineChart,
    title: "ROI-Driven Storytelling",
    body: "We don't 'make pictures'. We're the visualization infrastructure that lets US architects scale — like Twilio for messaging, but for the spaces you sell.",
  },
];

export function WhyDBros() {
  return (
    <section className="relative py-28 md:py-40 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">
            The DBros Difference
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[1.05]">
            Infrastructure for the way the <span className="italic">best US firms</span> ship.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="glass rounded-3xl p-8 flex flex-col gap-5"
            >
              <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground grid place-items-center">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl text-foreground">{it.title}</h3>
              <p className="text-foreground/70 leading-relaxed text-[15px]">{it.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
