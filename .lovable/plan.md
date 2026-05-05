# DBros.com — Luxury 3D Visualization Studio

A premium landing page positioning DBros as "infrastructure for US real estate developers and architects" — not just a render shop. Warm neutral palette, glassmorphism UI, 8K-focused visuals, with two AI-driven interactive tools.

## Visual System

- **Palette:** Cream `#F5F5F4`, Soft Beige `#E7E5E4`, Walnut/Oak `#57534E`, deep charcoal text, subtle gold accent for CTAs
- **Typography:** Playfair Display (headings, editorial feel) + Inter (body)
- **UI treatment:** Glassmorphism cards (frosted blur, hairline borders) so renders stay the hero
- **Motion:** Framer Motion — scroll-triggered fades, parallax hero, slider drags, silky page transitions
- **Layout:** Spacious, minimal, generous whitespace (Vercel × Architectural Digest)

## Page Structure (single landing route `/`)

1. **Sticky glass nav** — DBros wordmark, links (Work, AI Studio, ROI, Pricing, Contact), CTA "Book a Strategy Call"
2. **Hero**
   - Parallax background (8K interior still + subtle Ken Burns); video-ready slot
   - Headline: *"The Action Layer for US Real Estate: From Blueprints to 8K Reality."*
   - Sub: positioning line about scaling architects
   - Dual CTA: "See the Elite 12" / "Try the AI Transformer"
   - Trust strip: "400+ engineering hours saved · $4.2M pre-construction sales unlocked · 60+ projects shipped"
3. **AI Style Transformer** (Feature 1)
   - Upload a room photo (or pick a sample)
   - Choose signature style: Modern / Scandinavian / Industrial / Warm Luxury
   - Before/after **drag slider** comparison
   - Powered by Lovable AI image editing (Gemini image preview model) on the backend
4. **The Elite 12 Gallery**
   - Exactly 12 curated projects in an asymmetric editorial grid
   - Click → full-screen 8K lightbox with glass overlay case study:
     - The Challenge · The Visual Strategy · The Result (with $ outcome)
   - Keyboard nav, smooth zoom transition
5. **Instant ROI Calculator** (Feature 2)
   - Inputs: project size (Small / Medium / Commercial), asset type (Residential / Multifamily / Hospitality), market (e.g., Dallas, Miami, NYC)
   - Outputs: estimated property value lift %, days-to-market reduction, hours saved
   - Animated counters, shareable result card
6. **Why DBros / Infrastructure positioning**
   - Three-column: "Selective by Design" · "AI-Accelerated Pipeline" · "ROI-Driven Storytelling"
   - The "Twilio for architects" angle, hours-saved stat callouts
7. **Productized Pricing — Design Subscription**
   - Three tiers (illustrative): Studio $2,500/mo · Scale $6,500/mo · Enterprise (custom)
   - Each: deliverables/mo, turnaround SLA, included revisions, dedicated PM
   - "Fractional Design Team" framing instead of quote-based
8. **Searchable Archive teaser** — link to a future `/archive` for the full 60+ catalog (signals selectivity)
9. **Final CTA + footer** — booking strip, contact, socials

## AI Feature 1 — Style Transformer (technical)

- Frontend: file upload + style selector + before/after slider
- Backend: TanStack server function calls Lovable AI Gateway with `google/gemini-3.1-flash-image-preview` (image editing) using a curated style prompt per option
- Loading skeleton while generating; toast on rate-limit (429) / credits (402)
- Sample images included so visitors can try it without uploading

## AI Feature 2 — ROI Calculator (technical)

- Pure client-side heuristic model (transparent, instant) with weights per market/size/asset type — no AI call needed for v1
- Optional "Get a personalized analysis" CTA wires to lead capture later

## Elite 12 Content

Seeded with 12 placeholder luxury interior renders + written case-study copy following the 3-sentence template. User can swap images/text post-build.

## Technical Notes

- TanStack Start + React 19 + Tailwind v4 (already configured)
- Theme tokens added to `src/styles.css` for the warm neutral palette + Playfair/Inter font imports
- Framer Motion installed for parallax + scroll reveals
- Components: `Hero`, `StyleTransformer`, `EliteGallery`, `Lightbox`, `ROICalculator`, `Pricing`, `WhyDBros`, `Nav`, `Footer` under `src/components/landing/`
- Server function `src/server/style-transfer.functions.ts` for AI image edit via Lovable Cloud + AI Gateway (auto-enabled)
- Mobile-first responsive nav (slide-in glass drawer)
- Image optimization via responsive `srcset` + lazy loading; hero uses priority load

## Out of scope for v1 (can follow up)

- Live 8K video background (slot left ready; using high-res still for now)
- Full searchable archive page
- Auth, CMS, lead-capture backend, payment checkout for subscriptions
