import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { transformStyle } from "@/server/style-transfer.functions";
import { toast } from "sonner";
import sampleRoom from "@/assets/sample-room.jpg";
import { Loader2, Upload, Wand2 } from "lucide-react";

const STYLES = [
  { id: "warm_luxury", label: "Warm Luxury" },
  { id: "modern", label: "Modern" },
  { id: "scandinavian", label: "Scandinavian" },
  { id: "industrial", label: "Industrial" },
] as const;

type StyleId = (typeof STYLES)[number]["id"];

async function fileToBase64(file: File | Blob): Promise<{ base64: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const result = reader.result as string;
      const [meta, base64] = result.split(",");
      const mime = meta.match(/data:(.*?);base64/)?.[1] ?? "image/jpeg";
      resolve({ base64, mime });
    };
    reader.readAsDataURL(file);
  });
}

export function StyleTransformer() {
  const [originalUrl, setOriginalUrl] = useState<string>(sampleRoom);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [style, setStyle] = useState<StyleId>("warm_luxury");
  const [loading, setLoading] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const transformFn = useServerFn(transformStyle);

  const handleFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setResultUrl(null);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResultUrl(null);
    try {
      const blob = await fetch(originalUrl).then((r) => r.blob());
      const { base64, mime } = await fileToBase64(blob);
      const res = await transformFn({ data: { imageBase64: base64, mimeType: mime, style } });
      if (!res.ok) {
        toast.error(res.error);
      } else {
        setResultUrl(res.imageUrl);
        setSliderPos(50);
      }
    } catch (e) {
      console.error(e);
      toast.error("Couldn't reach the AI service.");
    } finally {
      setLoading(false);
    }
  };

  const onDrag = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pct)));
  };

  return (
    <section id="ai-studio" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">
            AI Studio · Feature 01
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[1.05]">
            DBros AI{" "}
            <span className="italic">Style Transformer</span>
          </h2>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
            Upload any room photo and preview it in our signature design languages — instantly. The same
            AI pipeline our team uses to scope projects in client pitches.
          </p>
        </motion.div>

        <div className="mt-14 grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative rounded-3xl overflow-hidden glass p-2"
          >
            <div
              ref={containerRef}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted select-none cursor-ew-resize"
              onMouseMove={(e) => e.buttons === 1 && onDrag(e.clientX)}
              onTouchMove={(e) => onDrag(e.touches[0].clientX)}
              onClick={(e) => onDrag(e.clientX)}
            >
              <img
                src={originalUrl}
                alt="Original room"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {resultUrl && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={resultUrl}
                    alt="DBros styled render"
                    className="absolute inset-0 h-full object-cover"
                    style={{ width: containerRef.current?.clientWidth ?? "100%" }}
                  />
                </div>
              )}

              {resultUrl && (
                <>
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-cream shadow-luxe pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full glass border-2 border-cream flex items-center justify-center pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <span className="text-[10px] font-medium uppercase tracking-wider">↔</span>
                  </div>
                </>
              )}

              <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] uppercase tracking-wider">
                Before
              </div>
              {resultUrl && (
                <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-[11px] uppercase tracking-wider">
                  DBros · {STYLES.find((s) => s.id === style)?.label}
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-sm">
                  <div className="flex items-center gap-3 glass rounded-full px-5 py-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Rendering your space…</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="glass rounded-3xl p-6 md:p-8 flex flex-col gap-6 h-fit"
          >
            <div>
              <div className="text-xs uppercase tracking-wider text-foreground/60 mb-3">1. Upload a room</div>
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-2xl border border-dashed border-border bg-card/40 px-4 py-5 text-sm hover:bg-card transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose photo (or use sample)
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-foreground/60 mb-3">2. Pick a signature style</div>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`rounded-xl px-3 py-2.5 text-sm transition-all ${
                      style === s.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/50 hover:bg-card text-foreground/80"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleGenerate}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {loading ? "Generating…" : "Transform with DBros AI"}
            </button>

            <p className="text-xs text-foreground/50 leading-relaxed">
              Generations are illustrative. Production work is hand-crafted in Blender by our 8K team.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
