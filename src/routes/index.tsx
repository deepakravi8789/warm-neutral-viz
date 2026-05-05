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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DBros — 8K 3D Interior Visualization for US Real Estate" },
      {
        name: "description",
        content:
          "DBros is the visualization infrastructure trusted by US developers and architects. AI-accelerated 8K renders that pre-sell properties and raise capital.",
      },
      { property: "og:title", content: "DBros — 8K 3D Interior Visualization Studio" },
      {
        property: "og:description",
        content:
          "From blueprints to 8K reality. Productized 3D visualization for elite US real estate developers and architects.",
      },
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
