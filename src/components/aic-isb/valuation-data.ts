import type { Startup, ThemeId } from "./startups-data";

export type Valuation = {
  arrUsdM: number; // Annual recurring revenue in millions USD
  multipleLow: number;
  multipleHigh: number;
  valuationLowM: number;
  valuationHighM: number;
  likes: string[];
  cautions: string[];
  why: string;
};

/** Sector-level benchmark ranges (used as the base if no override provided). */
const SECTOR_MULTIPLES: Record<ThemeId, [number, number]> = {
  ai: [8, 14],
  climate: [4, 7],
  health: [5, 9],
};

type Override = Omit<Valuation, "valuationLowM" | "valuationHighM">;

const overrides: Record<string, Override> = {
  neuralforge: {
    arrUsdM: 1.14,
    multipleLow: 9,
    multipleHigh: 11,
    likes: [
      "Strong enterprise demand",
      "High retention (94%)",
      "Clear operational ROI",
      "Difficult technical moat",
    ],
    cautions: ["Long enterprise sales cycles", "Complex onboarding & implementation"],
    why: "Strong enterprise traction and defensibility justify premium valuation despite operational complexity.",
  },
  echomind: {
    arrUsdM: 0.264,
    multipleLow: 4,
    multipleHigh: 5,
    likes: ["Viral user growth", "Strong consumer adoption"],
    cautions: ["Weak retention (19%)", "Poor monetization", "Unsustainable engagement"],
    why: "User growth alone is insufficient without strong retention and monetization.",
  },
  atlasmind: {
    arrUsdM: 3,
    multipleLow: 8,
    multipleHigh: 10,
    likes: ["DeepTech moat", "Strong enterprise contracts", "Large automation opportunity"],
    cautions: ["High burn rate", "Hardware-heavy scaling"],
    why: "Strong defensibility and market opportunity justify higher valuation despite capital intensity.",
  },
  visionpilot: {
    arrUsdM: 2.16,
    multipleLow: 8,
    multipleHigh: 10,
    likes: ["Strong enterprise demand", "Proprietary AI dataset", "Proven ROI"],
    cautions: ["Hardware installation dependency", "Field deployment bottleneck"],
    why: "Sticky enterprise retention and proven ROI justify a premium SaaS multiple.",
  },
  quantedge: {
    arrUsdM: 1.44,
    multipleLow: 9,
    multipleHigh: 11,
    likes: ["Sticky enterprise workflows", "96% retention", "Predictable SaaS revenue"],
    cautions: ["Reliance on external data APIs"],
    why: "Best-in-class retention and predictable revenue support a premium multiple.",
  },
  carbonloop: {
    arrUsdM: 3.6,
    multipleLow: 7,
    multipleHigh: 9,
    likes: ["Large industrial opportunity", "Climate policy tailwinds", "Enterprise demand"],
    cautions: ["Long procurement cycles", "Infrastructure-heavy deployments"],
    why: "Large climate opportunity offsets capital intensity and long procurement cycles.",
  },
  ecobyte: {
    arrUsdM: 1.32,
    multipleLow: 5,
    multipleHigh: 7,
    likes: ["ESG reporting trend", "SaaS business model"],
    cautions: ["Crowded analytics market", "Weak differentiation"],
    why: "Tailwinds are real but commoditization caps the premium investors are willing to pay.",
  },
  puresoil: {
    arrUsdM: 0.2,
    multipleLow: 4,
    multipleHigh: 5,
    likes: ["Sustainability innovation", "Strong mission alignment"],
    cautions: ["Slow adoption", "Difficult commercialization"],
    why: "Early-stage commercialization risk compresses the valuation even with strong mission alignment.",
  },
  pulsetrack: {
    arrUsdM: 2.4,
    multipleLow: 8,
    multipleHigh: 10,
    likes: ["Strong hospital adoption", "Recurring contracts", "High retention"],
    cautions: ["Regulatory complexity", "Workflow dependency"],
    why: "Sticky hospital contracts and recurring revenue justify a premium healthcare SaaS multiple.",
  },
  healmate: {
    arrUsdM: 0.3,
    multipleLow: 4,
    multipleHigh: 5,
    likes: ["Growing wellness market"],
    cautions: ["Weak monetization", "Poor retention"],
    why: "Without retention and monetization, even a growing market won't support a strong valuation.",
  },
  nanocure: {
    arrUsdM: 1.8,
    multipleLow: 10,
    multipleHigh: 14,
    likes: ["Deep scientific moat", "Strong healthcare potential"],
    cautions: ["Commercialization delays", "Regulatory timelines"],
    why: "Deep scientific moat justifies a premium multiple despite long commercialization timelines.",
  },
};

function parseUsd(value?: string): number | null {
  if (!value) return null;
  const m = value.match(/\$?([\d.]+)\s*([KMB])?/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const unit = (m[2] || "").toUpperCase();
  if (unit === "B") return n * 1000;
  if (unit === "M") return n;
  if (unit === "K") return n / 1000;
  return n / 1_000_000;
}

export function getValuation(s: Startup): Valuation {
  // Sector-aware defaults, then narrow by the startup's board score within the sector's range.
  const o = overrides[s.id];
  if (o) {
    return {
      ...o,
      valuationLowM: +(o.arrUsdM * o.multipleLow).toFixed(2),
      valuationHighM: +(o.arrUsdM * o.multipleHigh).toFixed(2),
    };
  }

  const mrrM = parseUsd(s.mrr) ?? 0.05;
  const arr = +(mrrM * 12).toFixed(2);

  const [sectorLow, sectorHigh] = SECTOR_MULTIPLES[s.themeId] ?? [5, 8];
  // Map boardScore (roughly 5-10) → position inside the sector's [low, high] window.
  const t = Math.max(0, Math.min(1, (s.boardScore - 5) / 5));
  const mid = sectorLow + (sectorHigh - sectorLow) * t;
  const half = Math.max(0.75, (sectorHigh - sectorLow) / 4);
  const low = +Math.max(sectorLow, mid - half).toFixed(1);
  const high = +Math.min(sectorHigh, mid + half).toFixed(1);

  return {
    arrUsdM: arr,
    multipleLow: low,
    multipleHigh: high,
    valuationLowM: +(arr * low).toFixed(2),
    valuationHighM: +(arr * high).toFixed(2),
    likes: s.strengths.slice(0, 3),
    cautions: s.risks.slice(0, 2),
    why:
      s.boardScore >= 8
        ? "Strong fundamentals and defensibility support a premium multiple within the sector range."
        : s.boardScore >= 6.5
          ? "Decent traction with execution risk warrants a mid-range multiple for the sector."
          : "Weak retention and unclear differentiation cap the multiple investors will pay.",
  };
}

export function classifyValuation(student: number, v: Valuation): "low" | "fair" | "high" {
  const fairLow = v.valuationLowM * 0.85;
  const fairHigh = v.valuationHighM * 1.15;
  if (student < fairLow) return "low";
  if (student > fairHigh) return "high";
  return "fair";
}

export function classifyMultiple(student: number, v: Valuation): "low" | "fair" | "high" {
  if (student < v.multipleLow - 1) return "low";
  if (student > v.multipleHigh + 1) return "high";
  return "fair";
}