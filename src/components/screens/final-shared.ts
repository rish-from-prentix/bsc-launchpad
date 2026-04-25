// Pure helpers + copy strings for the final results screens.
// Centralized so post copy is auditable in one place and never edited inline.

export type PerfTier = "high" | "mid" | "low";

export function getPerformanceTier(ebitda: number): PerfTier {
  if (ebitda >= 5_000_000) return "high";
  if (ebitda >= 3_500_000) return "mid";
  return "low";
}

export function buildHeadline(name: string, tier: PerfTier): string {
  const n = name?.trim() || "there";
  if (tier === "high") return `You think like an operator, ${n}. That's rare.`;
  if (tier === "mid") return `Strong run, ${n}. You made the calls that mattered.`;
  return `You played the full game, ${n}. That's already more than most.`;
}

export function buildSubtext(tier: PerfTier): string {
  if (tier === "high")
    return "Five months. Eighteen SKU-city combinations. Budget crunches, demand spikes, festival seasons. You navigated all of it and came out ahead.";
  if (tier === "mid")
    return "Not every month went perfectly — and that's the point. You adjusted, you learned, and you finished strong.";
  return "The best operators in the world made their worst mistakes early. What matters is that you made real decisions and understood why they worked or didn't.";
}

export const SKILLS: string[] = [
  "Demand Planning",
  "Inventory Optimisation",
  "Newsvendor Analysis",
  "Marketing Budget Allocation",
  "Marketing Elasticity Analysis",
  "Channel Strategy (D2C vs Quick Commerce)",
  "Supply Chain Decision-Making",
  "EBITDA Optimisation",
  "Cross-city Operations Management",
  "Data-driven Trade-off Analysis",
  "Working Capital Management",
  "Scenario Planning under Uncertainty",
];

export type PostVariant = "A" | "B" | "C" | "D";

export function selectPostVariant(tier: PerfTier, seed: number): PostVariant {
  if (tier === "high") return seed < 0.5 ? "A" : "B";
  if (tier === "mid") return "C";
  return "D";
}

// EBITDA placeholder is the literal token {EBITDA} (replaced with a Cr value
// like "5.42"). Post copy is verbatim per spec — do not edit wording.
export const POST_TEMPLATES: Record<PostVariant, string> = {
  A: `I just wrapped up a virtual internship with Bombay Shaving Company and I genuinely
didn't expect it to be this intense.

Over 5 months, I managed inventory and marketing budgets for 3 products across
Bangalore, Bombay, and Hyderabad. ₹{EBITDA}Cr in cumulative profit across the run.

Some things I learned the hard way:
- Stockouts don't just hurt this month. They compress your demand baseline going forward.
- Marketing elasticity varies wildly by channel and city. Pouring budget into a
  low-elasticity channel is one of the most common mistakes in growth ops.
- The Newsvendor model is genuinely useful. I'd never used it before this.

Grateful to Prentix for building something this real. Thanks to Shantanu Deshpande
and the BSC team for the experience.

If you want to try it: prentix.ai`,

  B: `Most internships give you tasks. This one gave me P&L responsibility.

I spent 5 months as a virtual Growth & Business Ops Intern at Bombay Shaving Company,
managing inventory and marketing across 3 cities. Finished with ₹{EBITDA}Cr in
cumulative EBITDA.

The decisions that surprised me most weren't the big ones. They were the small ones —
which supplier to use in Hyderabad, whether to cut inventory or increase marketing
when Bombay conversions dipped. Those trade-offs compound fast.

Powered by Prentix. Genuinely recommend it if you want to understand how a
high-growth consumer brand actually operates.

prentix.ai`,

  C: `I just finished a 5-month virtual internship with Bombay Shaving Company — and it
was harder than I expected.

I was responsible for inventory planning and marketing budgets across 3 SKUs and
3 cities. The simulation threw a demand spike, a festival season, a competitor
eating into our Bombay market share, and a budget crunch — all across 5 months.

Ended with ₹{EBITDA}Cr in cumulative profit. Not a perfect run, but a real one.

The experience gave me a clearer picture of how supply chain and growth decisions
interact inside a consumer brand. Grateful to Prentix and the BSC team for building
something this honest.

prentix.ai`,

  D: `Finished my virtual internship with Bombay Shaving Company this week.

5 months. 3 cities. 3 products. Real trade-offs between inventory, marketing,
and channel strategy.

Honestly, I made mistakes. I understocked during a demand spike. I over-indexed
on a low-elasticity channel early on. But I understood exactly why each decision
cost me what it did — and that's the point.

₹{EBITDA}Cr across the run. Already know what I'd do differently.

Thanks to Prentix for the platform and BSC for making this available.

prentix.ai`,
};

const RESUME_TEMPLATE = `Growth & Business Ops Intern — Bombay Shaving Company (Virtual, via Prentix)
Managed inventory and marketing budgets across 3 SKUs and 3 cities over 5 months.
Applied demand planning, Newsvendor analysis, and channel strategy (D2C and Quick
Commerce) to optimise EBITDA. Navigated demand spikes, budget constraints, and
competitive market shifts to deliver ₹{EBITDA}Cr in cumulative profit.`;

export function ebitdaInCr(ebitda: number): string {
  return (ebitda / 10_000_000).toFixed(2);
}

export function fillTemplate(template: string, ebitdaCr: string): string {
  return template.split("{EBITDA}").join(ebitdaCr);
}

export function buildResumeLine(ebitdaCr: string): string {
  return fillTemplate(RESUME_TEMPLATE, ebitdaCr);
}

export function buildPost(variant: PostVariant, ebitdaCr: string): string {
  return fillTemplate(POST_TEMPLATES[variant], ebitdaCr);
}