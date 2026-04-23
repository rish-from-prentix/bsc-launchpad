// Pure-function simulation engine for BSC Virtual Internship.
// All values are 1-indexed by cell number (1..9). Index 0 unused.

export const QC_COMMISSION_RATE = 0.15;
export const RETURN_PENALTY = 30;

export const UNIT_COST_BASE = {
  razor_hyd_nearby: 160,
  razor_hyd_far: 140,
  razor_blr: 140,
  razor_bom: 140,
  beard: 210,
  hair: 95,
} as const;

export const SELLING_PRICE = {
  razor: 349,
  beard: 599,
  hair: 249,
} as const;

export const HOLDING_COST = {
  razor: 15,
  beard: 25,
  hair: 10,
} as const;

export const CITY_GROWTH = {
  hyd: 1.2,
  blr: 1.1,
  bom: 1.1,
} as const;

export const SEASONAL_FACTOR: Record<number, number> = {
  1: 1.0,
  2: 1.2,
  3: 1.0,
  4: 1.0,
  5: 1.0,
};

export const MONTHLY_BUDGET: Record<number, number> = {
  1: 930000,
  2: 970000,
  3: 1010000,
  4: 1050000,
  5: 770000,
};

export type Sku = "razor" | "beard" | "hair";
export type City = "hyd" | "blr" | "bom";
export type Channel = "qc" | "d2c";
export type Sourcing = "nearby" | "far";
export type SourcingChoice = Sourcing | null;

export type CellMeta = {
  cell: number;
  sku: Sku;
  city: City;
  skuLabel: string;
  cityLabel: string;
};

export const CELL_META: (CellMeta | null)[] = [
  null,
  { cell: 1, sku: "razor", city: "hyd", skuLabel: "Razor Kit", cityLabel: "Hyderabad" },
  { cell: 2, sku: "razor", city: "blr", skuLabel: "Razor Kit", cityLabel: "Bangalore" },
  { cell: 3, sku: "razor", city: "bom", skuLabel: "Razor Kit", cityLabel: "Bombay" },
  { cell: 4, sku: "beard", city: "hyd", skuLabel: "Beard Oil", cityLabel: "Hyderabad" },
  { cell: 5, sku: "beard", city: "blr", skuLabel: "Beard Oil", cityLabel: "Bangalore" },
  { cell: 6, sku: "beard", city: "bom", skuLabel: "Beard Oil", cityLabel: "Bombay" },
  { cell: 7, sku: "hair", city: "hyd", skuLabel: "Hair Removal", cityLabel: "Hyderabad" },
  { cell: 8, sku: "hair", city: "blr", skuLabel: "Hair Removal", cityLabel: "Bangalore" },
  { cell: 9, sku: "hair", city: "bom", skuLabel: "Hair Removal", cityLabel: "Bombay" },
];

export const CHANNEL_LABEL: Record<Channel, string> = {
  qc: "Quick Commerce",
  d2c: "D2C",
};

export type ArrN = (number | null)[];

export type MonthData = {
  month: number; // 0..5
  inventory: { iq: ArrN; id: ArrN };
  marketing: { mq: ArrN; md: ArrN };
  elasticity: { qc: ArrN; d2c: ArrN };
  sales: { sq: ArrN; sd: ArrN }; // actual sales
  projectedDemand: { sq: ArrN; sd: ArrN };
  sourcing: SourcingChoice; // 'nearby' | 'far' | null  (cell 1, Hyd Razor, this month)
  carried?: { iq: ArrN; id: ArrN }; // carried inventory at start of month n
  reasoning?: string;
  totalProfit?: number;
  perCellProfit?: { qc: ArrN; d2c: ArrN };
  locked?: boolean;
};

export const MONTH_0: MonthData = {
  month: 0,
  inventory: {
    iq: [null, 310, 590, 680, 140, 670, 660, 140, 410, 520],
    id: [null, 220, 510, 390, 240, 890, 1100, 80, 350, 340],
  },
  marketing: {
    mq: [null, 9000, 18000, 28000, 5000, 12000, 14000, 6000, 14000, 18000],
    md: [null, 7000, 15000, 22000, 11000, 26000, 32000, 5000, 12000, 16000],
  },
  elasticity: {
    qc: [null, 1.0, 1.6, 0.6, 0.7, 1.3, 1.5, 1.3, 1.3, 1.1],
    d2c: [null, 1.0, 0.9, 1.0, 0.9, 1.4, 1.5, 1.1, 0.9, 1.1],
  },
  sales: {
    sq: [null, 290, 610, 820, 110, 280, 340, 160, 390, 480],
    sd: [null, 180, 490, 410, 210, 610, 310, 140, 350, 310],
  },
  projectedDemand: {
    sq: [null, 290, 610, 820, 110, 280, 340, 160, 390, 480],
    sd: [null, 180, 490, 410, 210, 610, 310, 140, 350, 310],
  },
  sourcing: null,
  locked: true,
};

export const BASE_ELASTICITY = MONTH_0.elasticity;

/**
 * Pre-seeded carried inventory at the start of Month 1.
 * = max(0, MONTH_0.inventory − MONTH_0.sales). Cells with 0 had a stockout in Month 0.
 */
export const MONTH_1_CARRIED: { iq: ArrN; id: ArrN } = {
  iq: [null, 20, 0, 0, 30, 390, 320, 0, 20, 40],
  id: [null, 40, 20, 0, 30, 280, 790, 0, 0, 30],
};

/**
 * Computes physically-leftover inventory at the start of month n+1 from
 * month n's submitted inventory and computed sales.
 */
export function carriedFromMonth(m: MonthData): { iq: ArrN; id: ArrN } {
  const iq: ArrN = [null];
  const id: ArrN = [null];
  for (let i = 1; i <= 9; i++) {
    const invQ = m.inventory.iq[i] ?? 0;
    const invD = m.inventory.id[i] ?? 0;
    const sQ = m.sales.sq[i] ?? 0;
    const sD = m.sales.sd[i] ?? 0;
    iq[i] = Math.max(0, invQ - sQ);
    id[i] = Math.max(0, invD - sD);
  }
  return { iq, id };
}

/**
 * Returns the carried inventory the student SEES at the start of month n.
 * Month 1 → MONTH_1_CARRIED. Month n → carriedFromMonth(prev).
 */
export function carriedForMonth(monthNumber: number, prev: MonthData): { iq: ArrN; id: ArrN } {
  if (monthNumber <= 1) return { iq: [...MONTH_1_CARRIED.iq], id: [...MONTH_1_CARRIED.id] };
  return carriedFromMonth(prev);
}

/**
 * Unit cost per cell. For cell 1 (Hyd Razor), uses weighted average of
 * the chosen single supplier. For other cells, returns the flat base cost.
 */
export function unitCostFor(cell: number, sourcing?: SourcingChoice): number {
  const meta = CELL_META[cell];
  if (!meta) return 0;
  if (cell === 1) {
    if (sourcing === "nearby") return UNIT_COST_BASE.razor_hyd_nearby;
    return UNIT_COST_BASE.razor_hyd_far; // default / 'far'
  }
  switch (meta.sku) {
    case "razor":
      return UNIT_COST_BASE.razor_blr; // 140 for blr/bom
    case "beard":
      return UNIT_COST_BASE.beard;
    case "hair":
      return UNIT_COST_BASE.hair;
  }
}

export function holdingCostFor(cell: number): number {
  const meta = CELL_META[cell];
  if (!meta) return 0;
  return HOLDING_COST[meta.sku];
}

export function sellingPriceFor(cell: number): number {
  const meta = CELL_META[cell];
  if (!meta) return 0;
  return SELLING_PRICE[meta.sku];
}

/**
 * Computes elasticity for a given month using previous month's data.
 * Month 1 returns BASE_ELASTICITY directly (no prior month).
 */
export function computeElasticity(monthNumber: number, prev: MonthData): { qc: ArrN; d2c: ArrN } {
  if (monthNumber === 1) {
    return { qc: [...BASE_ELASTICITY.qc], d2c: [...BASE_ELASTICITY.d2c] };
  }
  const qc: ArrN = [null];
  const d2c: ArrN = [null];
  for (let i = 1; i <= 9; i++) {
    qc[i] = updateOne(prev.marketing.mq[i], MONTH_0.marketing.mq[i], prev.elasticity.qc[i], BASE_ELASTICITY.qc[i]);
    d2c[i] = updateOne(prev.marketing.md[i], MONTH_0.marketing.md[i], prev.elasticity.d2c[i], BASE_ELASTICITY.d2c[i]);
  }
  return { qc, d2c };
}

function updateOne(prevMkt: number | null, baseMkt: number | null, prevE: number | null, baseE: number | null): number {
  if (prevMkt == null || baseMkt == null || prevE == null || baseE == null) return prevE ?? 1;
  if (prevMkt > baseMkt) {
    return baseE * Math.pow(baseMkt / prevMkt, 0.5);
  } else if (prevMkt < baseMkt) {
    return prevE * 1.1;
  }
  return prevE;
}

/**
 * Computes projected demand and actual sales for the current month given
 * user submission and previous month's data.
 */
export function computeMonth(
  monthNumber: number,
  submission: {
    inventory: { iq: ArrN; id: ArrN };
    marketing: { mq: ArrN; md: ArrN };
    sourcing: SourcingChoice;
    reasoning?: string;
    carried: { iq: ArrN; id: ArrN };
  },
  prev: MonthData,
  elasticity: { qc: ArrN; d2c: ArrN }
): MonthData {
  const projectedSq: ArrN = [null];
  const projectedSd: ArrN = [null];
  const actualSq: ArrN = [null];
  const actualSd: ArrN = [null];
  const profitQ: ArrN = [null];
  const profitD: ArrN = [null];
  let totalProfit = 0;

  for (let i = 1; i <= 9; i++) {
    const meta = CELL_META[i]!;
    const uc = unitCostFor(i, submission.sourcing);
    const sp = sellingPriceFor(i);
    const hc = holdingCostFor(i);
    const cityG = CITY_GROWTH[meta.city];
    const seas = SEASONAL_FACTOR[monthNumber];

    // QC channel
    {
      const prevDem = prev.projectedDemand.sq[i] ?? 0;
      const prevMkt = prev.marketing.mq[i] ?? 0;
      const curMkt = submission.marketing.mq[i] ?? 0;
      const e = elasticity.qc[i] ?? 0;
      const mktDelta = prevMkt > 0 ? (curMkt - prevMkt) / prevMkt : 0;
      const dem = prevDem * cityG * seas * (1 + e * mktDelta);
      projectedSq[i] = Math.max(0, Math.round(dem));
      const inv = submission.inventory.iq[i] ?? 0;
      const sales = Math.min(projectedSq[i] as number, inv);
      actualSq[i] = sales;

      const revenue = sales * sp;
      const commission = revenue * QC_COMMISSION_RATE;
      const cogs = sales * uc;
      const holding = Math.max(0, inv - sales) * hc;
      const mkt = curMkt;
      const p = revenue - commission - cogs - holding - mkt;
      profitQ[i] = Math.round(p);
      totalProfit += p;
    }
    // D2C channel
    {
      const prevDem = prev.projectedDemand.sd[i] ?? 0;
      const prevMkt = prev.marketing.md[i] ?? 0;
      const curMkt = submission.marketing.md[i] ?? 0;
      const e = elasticity.d2c[i] ?? 0;
      const mktDelta = prevMkt > 0 ? (curMkt - prevMkt) / prevMkt : 0;
      const dem = prevDem * cityG * seas * (1 + e * mktDelta);
      projectedSd[i] = Math.max(0, Math.round(dem));
      const inv = submission.inventory.id[i] ?? 0;
      const sales = Math.min(projectedSd[i] as number, inv);
      actualSd[i] = sales;

      const revenue = sales * sp;
      const cogs = sales * uc;
      const holding = Math.max(0, inv - sales) * hc;
      const mkt = curMkt;
      const p = revenue - cogs - holding - mkt;
      profitD[i] = Math.round(p);
      totalProfit += p;
    }
  }

  return {
    month: monthNumber,
    inventory: submission.inventory,
    marketing: submission.marketing,
    elasticity,
    sales: { sq: actualSq, sd: actualSd },
    projectedDemand: { sq: projectedSq, sd: projectedSd },
    sourcing: submission.sourcing,
    carried: submission.carried,
    reasoning: submission.reasoning,
    totalProfit: Math.round(totalProfit),
    perCellProfit: { qc: profitQ, d2c: profitD },
    locked: true,
  };
}

/**
 * Live additional inventory expense based on current input vs CARRIED inventory.
 * Increases cost the budget. Returns refund (unit cost − ₹30) per unit returned.
 */
export function additionalInventoryExpense(
  current: { iq: ArrN; id: ArrN },
  carried: { iq: ArrN; id: ArrN },
  sourcing: SourcingChoice
): number {
  let sum = 0;
  for (let i = 1; i <= 9; i++) {
    const uc = unitCostFor(i, sourcing);
    for (const ch of ["iq", "id"] as const) {
      const p = carried[ch][i] ?? 0;
      const c = current[ch][i] ?? 0;
      const diff = c - p;
      if (diff >= 0) sum += diff * uc;
      else sum += diff * (uc - RETURN_PENALTY); // diff is negative -> reduces sum
    }
  }
  return Math.round(sum);
}

export function totalMarketing(m: { mq: ArrN; md: ArrN }): number {
  let sum = 0;
  for (let i = 1; i <= 9; i++) {
    sum += m.mq[i] ?? 0;
    sum += m.md[i] ?? 0;
  }
  return sum;
}

// Format helpers
export function fmtINR(n: number): string {
  if (n == null || isNaN(n)) return "₹0";
  const abs = Math.abs(Math.round(n));
  const sign = n < 0 ? "-" : "";
  // Indian numbering grouping
  const s = abs.toString();
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  if (rest.length === 0) return `${sign}₹${last3}`;
  const restFmt = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}₹${restFmt},${last3}`;
}

export function fmtINRShort(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)}L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  return `${sign}₹${Math.round(abs)}`;
}

// Feedback evaluation
export type FeedbackTone = "good" | "warn" | "bad";
export type FeedbackCard = {
  tone: FeedbackTone;
  title: string;
  body: string;
};

export function evaluateFeedback(
  monthNumber: number,
  current: MonthData,
  prev: MonthData,
  allMonths: MonthData[]
): FeedbackCard[] {
  const good: FeedbackCard[] = [];
  const warn: FeedbackCard[] = [];
  const bad: FeedbackCard[] = [];

  const carried =
    current.carried ?? carriedForMonth(monthNumber, prev);

  // Per-cell, per-channel rules
  for (let i = 1; i <= 9; i++) {
    const meta = CELL_META[i]!;
    for (const ch of ["qc", "d2c"] as const) {
      const e = ch === "qc" ? current.elasticity.qc[i] : current.elasticity.d2c[i];
      const curMkt = ch === "qc" ? current.marketing.mq[i] : current.marketing.md[i];
      const prevMkt = ch === "qc" ? prev.marketing.mq[i] : prev.marketing.md[i];
      const inv = ch === "qc" ? current.inventory.iq[i] : current.inventory.id[i];
      const sales = ch === "qc" ? current.sales.sq[i] : current.sales.sd[i];
      const carriedHere = ch === "qc" ? (carried.iq[i] ?? 0) : (carried.id[i] ?? 0);
      if (e == null || curMkt == null || prevMkt == null || inv == null || sales == null) continue;
      const chLabel = ch === "qc" ? "Quick Commerce" : "D2C";
      const hc = holdingCostFor(i);

      const sellThrough = inv > 0 ? sales / inv : 0;

      // N1 — Full stockout (sold 100%)
      if (inv > 0 && sales >= inv) {
        bad.push({
          tone: "bad",
          title: `Stockout — ${meta.skuLabel}, ${meta.cityLabel}, ${chLabel}`,
          body: `You ran out of ${meta.skuLabel} in ${meta.cityLabel} via ${chLabel} before the month ended. Every customer who came after that walked away empty-handed — and likely went to a competitor. Stockouts don't just hurt this month's revenue. They erode the market you're trying to build.`,
        });
      } else if (inv > 0 && sellThrough >= 0.95) {
        // W1 — Near stockout (95-99%)
        warn.push({
          tone: "warn",
          title: `Cutting it close — ${meta.skuLabel}, ${meta.cityLabel}, ${chLabel}`,
          body: `You sold ${Math.round(sellThrough * 100)}% of your inventory here. That's efficient but risky — a small demand uptick would have caused a stockout. Consider whether a small buffer makes sense next month.`,
        });
      } else if (inv > 0 && sellThrough >= 0.85) {
        // P1 — Tight inventory (85-94%)
        good.push({
          tone: "good",
          title: "Tight inventory management",
          body: `You sold ${Math.round(sellThrough * 100)}% of your ${meta.skuLabel} inventory in ${meta.cityLabel} via ${chLabel} this month. That's efficient capital deployment — you're not leaving money sitting in a warehouse.`,
        });
      }

      // W3 — Severe excess (>=3x sales), W2 — excess (2x-3x)
      if (sales > 0 && inv >= sales * 3) {
        const idle = inv - sales;
        warn.push({
          tone: "warn",
          title: `Significant overstock — ${meta.skuLabel}, ${meta.cityLabel}, ${chLabel}`,
          body: `You're holding ${inv} units but only sold ${sales}. That's ${idle} units tied up in working capital, each costing ₹${hc}/month to hold. This is a pattern worth breaking early.`,
        });
      } else if (sales > 0 && inv >= sales * 2) {
        const idle = inv - sales;
        warn.push({
          tone: "warn",
          title: "Inventory running ahead of demand",
          body: `You have ${inv} units of ${meta.skuLabel} in ${meta.cityLabel} via ${chLabel} but only sold ${sales}. That's ${idle} units sitting idle, each costing ₹${hc} to hold. Consider trimming next month.`,
        });
      }

      // P2 / W4 — high elasticity
      if (e > 1.1 && curMkt > prevMkt) {
        good.push({
          tone: "good",
          title: "Smart spend on a high-elasticity channel",
          body: `You increased marketing for ${meta.skuLabel} in ${meta.cityLabel} via ${chLabel} where elasticity is ${e.toFixed(2)}. Every extra rupee there is pulling more than its weight. Good call.`,
        });
      } else if (e > 1.1 && curMkt <= prevMkt) {
        warn.push({
          tone: "warn",
          title: `Missed opportunity — ${meta.skuLabel}, ${meta.cityLabel}, ${chLabel}`,
          body: `Elasticity here is ${e.toFixed(2)} — that means every 1% increase in spend drives ${e.toFixed(2)}% more sales. You kept the budget flat. That's a high-yield channel left underutilized.`,
        });
      }

      // P10 / W5 — low elasticity
      if (e < 0.8 && curMkt <= prevMkt) {
        good.push({
          tone: "good",
          title: "Disciplined restraint",
          body: `You held back marketing for ${meta.skuLabel} in ${meta.cityLabel} via ${chLabel} where elasticity is only ${e.toFixed(2)}. Not every channel deserves more spend. Knowing where to hold is as valuable as knowing where to push.`,
        });
      } else if (e < 0.8 && curMkt > prevMkt) {
        warn.push({
          tone: "warn",
          title: `Low-yield ad spend — ${meta.skuLabel}, ${meta.cityLabel}, ${chLabel}`,
          body: `You increased marketing in a channel where elasticity is only ${e.toFixed(2)}. Each 1% extra spend only returns ${e.toFixed(2)}% in sales. That budget would have worked harder elsewhere.`,
        });
      }

      // N5 — Returned stock you needed
      if (carriedHere > inv && sales >= inv && inv > 0) {
        bad.push({
          tone: "bad",
          title: "Returned stock you needed",
          body: `You returned ${meta.skuLabel} inventory in ${meta.cityLabel} via ${chLabel} to free up budget, then ran out of stock mid-month. The ₹30 return cost per unit plus the lost sales made this a double loss. Returning inventory only makes sense when you have clear evidence demand won't materialize.`,
        });
      }
    }

    // P6 — Hyderabad growth capture (cells 1, 4, 7)
    if ([1, 4, 7].includes(i)) {
      for (const ch of ["iq", "id"] as const) {
        const inv = current.inventory[ch][i] ?? 0;
        const c = carried[ch][i] ?? 0;
        if (c > 0 && inv >= c * 1.3) {
          good.push({
            tone: "good",
            title: "Investing in a growing market",
            body: `You added significant inventory in Hyderabad. With 20% projected MoM growth there, building supply ahead of demand is exactly the right instinct for a new market.`,
          });
          break;
        }
      }
    }
  }

  // Sourcing rules — Hyd Razor (cell 1)
  const sourcing = current.sourcing;
  const hydBeardStockedOut =
    ((current.inventory.iq[4] ?? 0) > 0 && (current.sales.sq[4] ?? 0) >= (current.inventory.iq[4] ?? 0)) ||
    ((current.inventory.id[4] ?? 0) > 0 && (current.sales.sd[4] ?? 0) >= (current.inventory.id[4] ?? 0));

  if (monthNumber === 3) {
    if (sourcing === "nearby") {
      good.push({
        tone: "good",
        title: "Right call under pressure",
        body: `With inventory running out in Hyderabad, you prioritized speed over cost. The nearby supplier costs more but the alternative was two weeks of lost sales. Well played.`,
      });
      if (hydBeardStockedOut) {
        bad.push({
          tone: "bad",
          title: "Right instinct, wrong SKU",
          body: `You ordered from the nearby supplier — good instinct for speed. But the spike was in Beard Oil, and inventory there still ran short. Next time, trace the signal all the way to the specific SKU before placing the order.`,
        });
      }
    } else if (sourcing === "far" && hydBeardStockedOut) {
      bad.push({
        tone: "bad",
        title: "Speed mattered here — wrong supplier",
        body: `You ordered from the faraway supplier to save ₹20 per unit, but the inventory was needed urgently. It arrived too late. The margin saving was wiped out by the sales you missed while waiting.`,
      });
    }
  } else {
    // Non-Month-3 sourcing
    if (sourcing === "far") {
      good.push({
        tone: "good",
        title: "Margin-conscious sourcing",
        body: `You ordered Hyderabad Razor Kits from the faraway supplier. That's ₹20 saved per unit. If you didn't need inventory urgently, this was exactly the right call.`,
      });
    } else if (sourcing === "nearby") {
      warn.push({
        tone: "warn",
        title: "Sourcing cost note",
        body: `You ordered Hyderabad Razor Kits from the nearby supplier at ₹160/unit. The faraway option is ₹140. Unless you needed inventory urgently, that's ₹20 per unit left on the table.`,
      });
    }
  }

  // N2/N3 — Hyd Beard Oil spike (Month 3)
  if (monthNumber === 3) {
    for (const ch of ["sq", "sd"] as const) {
      const proj = current.projectedDemand[ch][4] ?? 0;
      const sales = current.sales[ch][4] ?? 0;
      if (proj <= 0) continue;
      const ratio = sales / proj;
      if (ratio < 0.7) {
        bad.push({
          tone: "bad",
          title: "Missed the Hyderabad spike",
          body: `The influencer reel drove a surge in Beard Oil demand in Hyderabad. By not increasing inventory, we ran out in roughly two weeks. The last half of the month was dead sales — and every customer who couldn't find the product found someone else who had it.`,
        });
        break;
      } else if (ratio >= 0.7 && ratio < 0.9) {
        bad.push({
          tone: "bad",
          title: "Partially missed the Hyderabad spike",
          body: `You increased Beard Oil inventory in Hyderabad, but not enough. We still ran short before the month was out. Partial preparation is better than none, but demand outpaced your stock in the final stretch.`,
        });
        break;
      }
    }
  }

  // P5 / W6 — Festival season prep (Month 2)
  if (monthNumber === 2) {
    let increases = 0;
    for (let i = 1; i <= 9; i++) {
      const cQ = carried.iq[i] ?? 0;
      const cD = carried.id[i] ?? 0;
      const iQ = current.inventory.iq[i] ?? 0;
      const iD = current.inventory.id[i] ?? 0;
      if (iQ > cQ) increases++;
      if (iD > cD) increases++;
    }
    if (increases >= 4) {
      good.push({
        tone: "good",
        title: "Festival season — well prepared",
        body: `You stocked up ahead of the demand spike. Brands that don't prepare for festival season leave their best sales window understocked. You didn't make that mistake.`,
      });
    } else if (increases < 3) {
      warn.push({
        tone: "warn",
        title: "Festival season — underweight",
        body: `You didn't materially increase inventory heading into festival season. Demand spikes 20-30% this period. If demand came in at the high end, you likely left sales on the table.`,
      });
    }
  }

  // P7 / W7 — Bombay Razor (Month 4)
  if (monthNumber === 4) {
    const prevMq = prev.marketing.mq[3] ?? 0;
    const prevMd = prev.marketing.md[3] ?? 0;
    const curMq = current.marketing.mq[3] ?? 0;
    const curMd = current.marketing.md[3] ?? 0;
    const mktUp = curMq > prevMq || curMd > prevMd;
    const carriedQ = carried.iq[3] ?? 0;
    const carriedD = carried.id[3] ?? 0;
    const curInvQ = current.inventory.iq[3] ?? 0;
    const curInvD = current.inventory.id[3] ?? 0;
    const invDown = curInvQ < carriedQ || curInvD < carriedD;
    if (mktUp) {
      good.push({
        tone: "good",
        title: "Right diagnosis, right response",
        body: `You increased marketing for Razor Kits in Bombay instead of cutting inventory. That's the correct read — this was a visibility problem, not a demand problem. Reducing inventory would have made it worse.`,
      });
    } else if (invDown && !mktUp) {
      warn.push({
        tone: "warn",
        title: "Wrong lever in Bombay",
        body: `You reduced inventory for Razor Kits in Bombay but didn't increase marketing. The problem was visibility — customers couldn't find the product. Cutting supply made the symptom worse, not better.`,
      });
    }
  }

  // P8 — D2C Bangalore Beard Oil high elasticity
  {
    const cur = current.marketing.md[5] ?? 0;
    const p = prev.marketing.md[5] ?? 0;
    const e = current.elasticity.d2c[5] ?? 0;
    if (cur > p && e > 1.1) {
      good.push({
        tone: "good",
        title: "High-elasticity D2C play",
        body: `You shifted budget toward D2C Beard Oil in Bangalore. With elasticity at ${e.toFixed(2)}, that is one of the best-returning channels in your portfolio. Every extra rupee there compounds.`,
      });
    }
  }

  // P9 — Budget crunch handled well (Month 5)
  if (monthNumber === 5) {
    const totalMkt = totalMarketing(current.marketing);
    const additional = additionalInventoryExpense(
      current.inventory,
      carried,
      current.sourcing
    );
    const remaining = MONTHLY_BUDGET[5] - additional - totalMkt;
    const profit5 = current.totalProfit ?? 0;
    const profit4 = allMonths[4]?.totalProfit ?? 0;
    if (remaining >= 0 && profit5 >= profit4 * 0.8) {
      good.push({
        tone: "good",
        title: "Clean budget crunch management",
        body: `Tighter budget, but you protected your profit. You found the cuts that mattered least and held the line on what drives real returns. That's disciplined operations.`,
      });
    }
  }

  // Render: positive → warning → negative
  return [...good, ...warn, ...bad];
}

// Pre-event budget remaining baseline (Month 1, no edits): 1260000 - 0 (additional) - sum of prev marketing
// which equals 270000. So baseline remaining = 990000. Provided as a sanity check constant.
export const MONTH_1_BASELINE_REMAINING = 990000;

// Linkedin post body (verbatim)
export const LINKEDIN_POST_BODY = `I recently wrapped up my virtual internship with Bombay Shaving Company. I got to work closely on growth and operations across key product lines and geographies.

Some of the things I worked on:
- Tracking product performance across D2C and Quick Commerce.
- Budget allocation, demand forecasting and inventory planning across cities.

I noticed how things barely go as per plan. With unforeseen demand spikes, stock runouts, and excess inventory, there's a constant trade-off between pushing growth and managing supply efficiently.

Grateful to Prentix for the opportunity to learn how these decisions are actually made inside a fast-growing consumer brand. Thanks to Shantanu Deshpande and the team at Bombay Shaving Company for many learnings I will carry for life!

PS: Apply for virtual internships with India's leading brands on https://prentix.ai today!`;

// Per-month event email content
export type EventEmail = {
  sender: string;
  initials: string;
  subject: string;
  body: string; // [Name] gets replaced
};

export const MONTH_EVENTS: Record<number, EventEmail | null> = {
  1: null,
  2: {
    sender: "Shantanu Deshpande",
    initials: "SD",
    subject: "Heads up: Festival season incoming",
    body: `Hi [Name],

Quick heads up — we're heading into festival season. Historically, demand across all cities spikes 20-30% during this period. Plan accordingly.

All the best,
Shantanu`,
  },
  3: {
    sender: "Analytics Team",
    initials: "AT",
    subject: "Important update from Hyderabad",
    body: `Hi [Name],

Important update from Hyderabad: A local influencer's reel about our products went viral and we're seeing a sudden spike in searches for our Beard Oil. Orders are coming in faster than we can fulfill. If we maintain the same inventory levels as the previous month, we forecast that our inventory might run out in 14 days!

Please make decisions accordingly!`,
  },
  4: {
    sender: "Shantanu Deshpande",
    initials: "SD",
    subject: "Bombay update: Razor Kit numbers need your attention",
    body: `Hi [Name],

Quick heads-up from the Bombay team.

We're seeing a noticeable dip in Razor Kit conversions in Bombay this month. Our ops team has already ruled out the obvious culprits: payment failures, checkout bugs, delivery delays. The product is reaching customers fine.

Here's what we know. On Quick Commerce, a couple of competing brands have been running aggressive promotions over the past few weeks, and our share of search on Blinkit has slipped as a result. Customers who would have discovered us organically are now seeing competitors first. On D2C, traffic is holding steady, but conversion is soft. The brand team believes that this is a visibility problem, not a demand problem.

Now, you have a couple of levers here. You could reduce inventory, since sales have dipped. Or you could redirect some budget toward marketing to recover the visibility we've lost. Both can be right. Both can be wrong. I'll leave it to you to figure out which one actually addresses what's going on.

Looking forward to seeing how you approach this.
Shantanu`,
  },
  5: {
    sender: "Shantanu Deshpande",
    initials: "SD",
    subject: "Tighter budget this month — plan carefully",
    body: `Hi [Name],

We're working with a tighter budget this month. You only have ₹11,00,000 to work with. Think carefully about where every rupee goes. Would you reduce marketing? Would you reduce inventory? The right answer depends on where you've been spending and what the numbers are telling you.

All the best,
Shantanu`,
  },
};

export const MONTH_CONTEXT: Record<number, string> = {
  1: "Baseline",
  2: "Festival Season",
  3: "Demand Spike — Hyderabad",
  4: "Conversion Dip — Bombay",
  5: "Budget Crunch",
};

export const SHANTANU_WELCOME_BODY = `Hi [Name],

Welcome to the team.

Congratulations on stepping into a role that a lot of people aspire to work in. Over the next 5 months, you'll be managing inventory and marketing budgets for some of our key SKUs across Bangalore, Bombay, and Hyderabad. This means making smart trade-offs between margins and volume, while ensuring we continue to build trust with our customers. At Bombay Shaving Company, we don't believe in micromanagement. We trust you to own outcomes from day one. Take calls, make mistakes, learn fast, and keep moving.

As per our analytics team, we're expecting a month-on-month growth of 10% across SKUs and cities. However, since we've only launched recently in Hyderabad, I wouldn't be surprised if we see growth closer to 40% there.

In most cases, you'll have a reasonable estimate of demand. But there will be months where actual demand surprises you in either direction. Treat these estimates as informed guesses, not certainties, and plan with that uncertainty in mind.

As a rule of thumb, we like to keep at least 2 months of inventory handy. However, in certain situations, it is acceptable to go below this if it helps improve overall efficiency.

One more thing to keep in mind. In Hyderabad, you may notice that sourcing costs vary depending on the supplier. A nearby manufacturer means faster delivery but higher cost. A faraway one means lower cost but longer lead time. Choose wisely based on the situation.

All the best!
Shantanu`;