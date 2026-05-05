import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const STYLE_PROMPTS: Record<string, string> = {
  modern:
    "Transform this room into an ultra-modern luxury interior: clean lines, neutral palette with charcoal accents, designer furniture, polished concrete or marble floor, statement pendant lighting, floor-to-ceiling glazing. Photorealistic 8K architectural render.",
  scandinavian:
    "Transform this room into a Scandinavian luxury interior: warm white walls, light oak flooring, soft linen textiles, minimalist furniture, hygge lighting, abundant natural daylight, indoor plants. Photorealistic 8K architectural render.",
  industrial:
    "Transform this room into an industrial luxury loft: exposed brick, dark steel beams, polished concrete floor, leather and walnut furniture, Edison bulb lighting, oversized windows. Photorealistic 8K architectural render.",
  warm_luxury:
    "Transform this room into a warm-luxury interior: cream and beige palette, rich walnut wood paneling, brushed brass details, plush bouclé seating, golden-hour lighting, marble accents. Photorealistic 8K architectural render.",
};

const inputSchema = z.object({
  imageBase64: z.string().min(20),
  mimeType: z.string().default("image/jpeg"),
  style: z.enum(["modern", "scandinavian", "industrial", "warm_luxury"]),
});

export const transformStyle = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI gateway not configured." };
    }

    const prompt = STYLE_PROMPTS[data.style];
    const dataUrl = `data:${data.mimeType};base64,${data.imageBase64}`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: dataUrl } },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (res.status === 429) return { ok: false as const, error: "Rate limit reached. Please try again in a moment." };
      if (res.status === 402) return { ok: false as const, error: "AI credits exhausted. Add credits in Settings." };
      if (!res.ok) {
        const t = await res.text();
        console.error("AI gateway error", res.status, t);
        return { ok: false as const, error: "Couldn't transform the image right now." };
      }

      const json = await res.json();
      const msg = json?.choices?.[0]?.message;
      const imgUrl: string | undefined =
        msg?.images?.[0]?.image_url?.url ?? msg?.images?.[0]?.url;

      if (!imgUrl) {
        console.error("No image in AI response", JSON.stringify(json).slice(0, 500));
        return { ok: false as const, error: "AI did not return an image. Try a different photo." };
      }
      return { ok: true as const, imageUrl: imgUrl };
    } catch (e) {
      console.error("transformStyle error", e);
      return { ok: false as const, error: "Unexpected error. Please retry." };
    }
  });
