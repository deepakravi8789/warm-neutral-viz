import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { StyleTransformer } from "@/components/landing/StyleTransformer";
import { EliteGallery } from "@/components/landing/EliteGallery";
import { ROICalculator } from "@/components/landing/ROICalculator";
import { WhyDBros } from "@/components/landing/WhyDBros";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

const SITE_URL = "https://dbros.com";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const TITLE =
  "DBros — 8K 3D Interior Design & Architectural Rendering Studio | USA, UK, Australia";
const DESCRIPTION =
  "Premium 3D interior design, architectural visualization & 8K photorealistic rendering studio for luxury real estate developers and architects in the USA, UK, Canada and Australia. AI-accelerated renders that pre-sell properties and raise capital.";

const KEYWORDS = [
  "3d interior design",
  "3d interior rendering",
  "architectural visualization studio",
  "luxury 3d rendering services",
  "8k interior renders",
  "real estate 3d visualization usa",
  "3d rendering company uk",
  "3d architectural rendering australia",
  "interior design rendering services canada",
  "off-plan property visualization",
  "ai interior design",
  "blender architectural rendering",
  "high-end interior visualization",
  "3d rendering for developers",
].join(", ");

const ORG_LD = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: "DBros",
  alternateName: "DBros Studio",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: OG_IMAGE,
  description: DESCRIPTION,
  priceRange: "$$$$",
  areaServed: [
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "Australia" },
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
  serviceType: [
    "3D Interior Design",
    "Architectural Visualization",
    "8K Photorealistic Rendering",
    "AI Interior Style Transformation",
    "Real Estate Marketing Renders",
  ],
  sameAs: [
    "https://www.instagram.com/dbrosstudio",
    "https://www.linkedin.com/company/dbrosstudio",
    "https://www.behance.net/dbrosstudio",
  ],
};

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: "DBros",
  description: DESCRIPTION,
  inLanguage: "en",
};

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you work with US, UK and Australian real estate developers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. DBros serves luxury developers, architects and design studios across the United States, United Kingdom, Australia, Canada and the UAE with 8K interior renders and full visualization packages.",
      },
    },
    {
      "@type": "Question",
      name: "How fast can you deliver 8K interior renders?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most hero renders ship in 5–10 business days. Our AI-accelerated Blender pipeline compresses scene debugging and batch scripting so we deliver 8K quality faster than traditional firms.",
      },
    },
    {
      "@type": "Question",
      name: "What does a 3D interior visualization project cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We work as a fractional design team starting at $2,500/month, and on per-project hero packages. Pricing scales with scope, finish complexity and turnaround.",
      },
    },
    {
      "@type": "Question",
      name: "Can renders help us pre-sell off-plan properties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely — our renders have helped developers secure $4.2M+ in pre-construction sales and shorten buyer decision time from 90 to 23 days.",
      },
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: KEYWORDS },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "DBros — 8K luxury interior rendering" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "alternate", hrefLang: "en-us", href: SITE_URL },
      { rel: "alternate", hrefLang: "en-gb", href: SITE_URL },
      { rel: "alternate", hrefLang: "en-au", href: SITE_URL },
      { rel: "alternate", hrefLang: "en-ca", href: SITE_URL },
      { rel: "alternate", hrefLang: "x-default", href: SITE_URL },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(ORG_LD) },
      { type: "application/ld+json", children: JSON.stringify(WEBSITE_LD) },
      { type: "application/ld+json", children: JSON.stringify(FAQ_LD) },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <StyleTransformer />
      <EliteGallery />
      <ROICalculator />
      <WhyDBros />
      <Pricing />
      <Footer />
      <Toaster position="bottom-center" />
    </main>
  );
}
