import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#work", label: "Work" },
  { href: "#ai-studio", label: "AI Studio" },
  { href: "#roi", label: "ROI" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-500 ${
          scrolled ? "glass rounded-full py-3 px-6" : ""
        }`}
        style={scrolled ? { width: "min(100% - 3rem, 80rem)" } : undefined}
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
            DBros<span className="text-accent">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/75 hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Book a Strategy Call
          </a>
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-full glass"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div
          className={`absolute right-0 top-0 h-full w-[82%] max-w-sm glass p-8 transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-12">
            <span className="font-display text-xl font-semibold">DBros.</span>
            <button onClick={() => setOpen(false)} className="p-2" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-display text-foreground"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              Book a Strategy Call
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
