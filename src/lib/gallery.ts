export type EliteProject = {
  id: number;
  title: string;
  location: string;
  image: string;
  span: "tall" | "wide" | "square";
  challenge: string;
  strategy: string;
  result: string;
};

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const ELITE_12: EliteProject[] = [
  {
    id: 1,
    title: "Highland Penthouse",
    location: "Dallas, TX",
    image: u("1600210492486-724fe5c67fb0"),
    span: "tall",
    challenge: "A 4,200 sq ft penthouse needed to pre-sell off-plan in a saturated luxury market.",
    strategy: "Twilight 8K renders emphasizing skyline framing, warm walnut millwork, and lifestyle staging.",
    result: "Helped the developer secure $4.2M in pre-construction sales within 6 weeks.",
  },
  {
    id: 2,
    title: "Bayfront Residence",
    location: "Miami, FL",
    image: u("1505693416388-ac5ce068fe85"),
    span: "wide",
    challenge: "Investors couldn't visualize the indoor-outdoor flow of a beachfront villa.",
    strategy: "Cinematic walkthrough plus 12 hero stills bridging interior to terrace and pool.",
    result: "Cut buyer decision time from 90 to 23 days on a $9.8M listing.",
  },
  { id: 3, title: "Park Avenue Loft", location: "New York, NY", image: u("1560448204-e02f11c3d0e2"), span: "square",
    challenge: "Conversion of a pre-war floor-through into 3 ultra-luxury units.",
    strategy: "Side-by-side 'before / vision' renders for the offering memorandum.",
    result: "All three units sold above ask before construction began." },
  { id: 4, title: "Cliffside Retreat", location: "Malibu, CA", image: u("1600585154340-be6161a56a0c"), span: "tall",
    challenge: "Articulating a complex multi-level architectural concept to non-technical investors.",
    strategy: "Sectional cutaway renders + drone-perspective exteriors at golden hour.",
    result: "Closed an $18M equity raise in a single investor meeting." },
  { id: 5, title: "Brownstone Reimagined", location: "Boston, MA", image: u("1600566753190-17f0baa2a6c3"), span: "wide",
    challenge: "Historic façade with a fully reworked interior — buyers couldn't square the two.",
    strategy: "Photoreal interiors paired with preserved exterior elevations.",
    result: "Saved 400 engineering hours by replacing a redesign cycle with a render iteration." },
  { id: 6, title: "Skyline Tower 38F", location: "Chicago, IL", image: u("1505691938895-1758d7feb511"), span: "square",
    challenge: "Marketing 22 identical-shell units with 4 finish packages.",
    strategy: "Modular 8K render system — swap finishes, keep camera, reuse lighting.",
    result: "Replaced $180k of physical model staging with a digital configurator." },
  { id: 7, title: "Hill Country Estate", location: "Austin, TX", image: u("1600596542815-ffad4c1539a9"), span: "tall",
    challenge: "Custom 9,800 sq ft estate, no comparable comps for the market.",
    strategy: "Lifestyle-driven storytelling: morning kitchen, evening study, sunset terrace.",
    result: "Achieved $1,420 per sq ft — 38% above neighborhood comp." },
  { id: 8, title: "Hospitality Suite", location: "Aspen, CO", image: u("1551776235-dde6d4829808"), span: "wide",
    challenge: "Boutique hotel rebrand needed to refresh 64 keys without closing.",
    strategy: "One render per typology, then AI-batched into all 8 floor variants.",
    result: "Compressed creative timeline from 14 weeks to 19 days." },
  { id: 9, title: "Coastal Modernist", location: "San Diego, CA", image: u("1502672260266-1c1ef2d93688"), span: "square",
    challenge: "First-time developer, no marketing collateral, 6-week launch window.",
    strategy: "Turnkey package: 12 stills, 1 reel, lifestyle copy, share-card kit.",
    result: "Sold out 6 of 6 units before the model home opened." },
  { id: 10, title: "Mountain Modern Lodge", location: "Park City, UT", image: u("1600607687939-ce8a6c25118c"), span: "tall",
    challenge: "Convince a council that a contemporary form fit a historic ski village.",
    strategy: "Context-accurate site renders with seasonal variants (winter / summer).",
    result: "Approved unanimously on first hearing." },
  { id: 11, title: "Multifamily Flagship", location: "Seattle, WA", image: u("1600585154526-990dced4db0d"), span: "wide",
    challenge: "Lease-up of 312 units in a soft submarket.",
    strategy: "Amenity-led storytelling: rooftop, co-work, wellness floor — all 8K.",
    result: "Hit 92% pre-leased before TCO." },
  { id: 12, title: "Heritage Townhouse", location: "Charleston, SC", image: u("1505691723518-36a5ac3b2d35"), span: "square",
    challenge: "Restoration project balancing period detail with modern systems.",
    strategy: "Layered renders showing original, restored, and lifestyle states.",
    result: "Listed and went under contract in 11 days at full ask." },
];
