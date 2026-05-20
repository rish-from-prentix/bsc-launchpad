import type { Startup } from "./startups-data";

export type RcaCase = {
  problem: string;
  rootCauseLabel: string;
  keywords: string[]; // lowercase tokens that mark a strong root-cause answer
  revenue: number[]; // 6 points (relative)
  burn: number[];
  retention: number[];
  customerVoices: string[];
  teamNotes: string[];
  founderQuote: string;
  investorPressure: string;
  boardTags: string[];
  operationalMetrics: { label: string; value: string; trend: "up" | "down" | "flat" }[];
};

const cases: Record<string, RcaCase> = {
  neuralforge: {
    problem:
      "Over the last two quarters, NeuralForge AI has continued generating strong enterprise interest, with inbound leads increasing significantly after several successful pilot deployments. However, despite rising demand, revenue growth has slowed and deal closures have become inconsistent. Several enterprise customers delayed final contract signings after technical evaluations, while existing customers reported frustration regarding onboarding timelines and implementation delays. The sales team believes market demand remains strong, but the implementation team raised concerns around increasing customization requests and engineering dependency.",
    rootCauseLabel: "Operational scaling bottleneck — implementation & customization debt",
    keywords: ["implementation", "onboarding", "customization", "operational", "scaling", "delivery", "deployment", "engineering"],
    revenue: [40, 55, 70, 78, 80, 82],
    burn: [60, 65, 72, 78, 85, 92],
    retention: [94, 94, 92, 90, 88, 86],
    customerVoices: [
      "“Implementation took 3x longer than promised.”",
      "“Great product, but the rollout drained our team.”",
      "“We had to dedicate engineers just to integrate.”",
    ],
    teamNotes: [
      "Solutions engineers booked 6 weeks out",
      "70% of pilots require non-trivial customization",
      "Sales cycle ↑ from 71 → 118 days",
    ],
    founderQuote:
      "“We thought demand was the constraint — turns out, our delivery model is.”",
    investorPressure: "Board pushing for ARR > $2M before Series B; current trajectory misses by 2 quarters.",
    boardTags: ["Delivery bottleneck", "Engineering dependency", "Sales-implementation gap"],
    operationalMetrics: [
      { label: "Avg pilot → contract", value: "118 days", trend: "up" },
      { label: "Customization per deal", value: "70%", trend: "up" },
      { label: "Net new ARR (Q-o-Q)", value: "+4%", trend: "down" },
    ],
  },
  echomind: {
    problem:
      "EchoMind Labs experienced explosive user growth after a viral campaign generated millions of installs in a short period of time. Although downloads and signups remain strong, long-term engagement and subscription conversion rates have declined sharply over the past 3 months. The founders believe monetization strategy is the issue, while some advisors argue the deeper problem lies in retention and product stickiness.",
    rootCauseLabel: "Weak retention and unsustainable engagement",
    keywords: ["retention", "stickiness", "engagement", "habit", "churn", "d30", "weekly active"],
    revenue: [20, 26, 30, 32, 31, 28],
    burn: [80, 95, 110, 120, 122, 124],
    retention: [38, 30, 24, 20, 17, 14],
    customerVoices: [
      "“Fun for a week, forgot about it.”",
      "“Nothing pulls me back to open it.”",
      "“The AI feels samey after a few chats.”",
    ],
    teamNotes: [
      "D7 retention 24% → D30 retention 7%",
      "Subscription conversion 1.1% (industry avg 3–5%)",
      "Push notification CTR collapsing",
    ],
    founderQuote: "“We have the top of the funnel — we don’t have the loop.”",
    investorPressure: "Investors questioning unit economics; runway < 10 months at current burn.",
    boardTags: ["Retention collapse", "No habit loop", "Monetization symptom, not cause"],
    operationalMetrics: [
      { label: "D30 retention", value: "7%", trend: "down" },
      { label: "Paid conversion", value: "1.1%", trend: "down" },
      { label: "Burn multiple", value: "6.2x", trend: "up" },
    ],
  },
  visionpilot: {
    problem:
      "VisionPilot continues maintaining strong enterprise retention across retail clients, but expansion revenue from existing accounts has slowed significantly. While customers are satisfied with pilot deployments, multi-location rollouts have repeatedly been delayed due to installation complexity and operational dependencies.",
    rootCauseLabel: "Hardware deployment scalability bottleneck",
    keywords: ["hardware", "deployment", "installation", "rollout", "operations", "field", "logistics"],
    revenue: [50, 65, 80, 88, 90, 91],
    burn: [55, 60, 65, 72, 76, 80],
    retention: [91, 92, 93, 93, 92, 91],
    customerVoices: [
      "“Single-store rollout took 6 weeks per location.”",
      "“We love it — we just can’t deploy it fast.”",
      "“Need a partner network for installation.”",
    ],
    teamNotes: [
      "Field engineering team capped at 12 people",
      "Hardware lead times 8–10 weeks",
      "Account expansion blocked behind install queue",
    ],
    founderQuote: "“We solved the AI problem. We haven’t solved the rollout problem.”",
    investorPressure: "Series A board wants 4x location expansion to unlock B.",
    boardTags: ["Field ops bottleneck", "Capex-heavy scaling", "Partner network missing"],
    operationalMetrics: [
      { label: "Avg time-to-deploy", value: "42 days", trend: "up" },
      { label: "Locations live / quarter", value: "38", trend: "flat" },
      { label: "NRR", value: "108%", trend: "down" },
    ],
  },
  carbonloop: {
    problem:
      "CarbonLoop has experienced a sharp increase in inbound interest from large industrial manufacturers after several successful pilot deployments demonstrated measurable reductions in carbon emissions. Despite strong investor confidence and a rapidly growing enterprise pipeline, the startup has struggled to convert interest into long-term signed deployments. Procurement cycles have become significantly longer, implementation timelines are increasing, and several enterprise customers delayed expansion decisions despite positive pilot outcomes.",
    rootCauseLabel:
      "Enterprise procurement friction + infrastructure deployment complexity + capital intensity",
    keywords: ["procurement", "infrastructure", "deployment", "capital", "capex", "enterprise", "complexity"],
    revenue: [40, 55, 68, 78, 82, 85],
    burn: [65, 78, 90, 100, 112, 124],
    retention: [95, 95, 94, 93, 92, 90],
    customerVoices: [
      "“Procurement committee needs 9–12 months.”",
      "“Pilot was great — capex sign-off is another year.”",
      "“We need shared financing for full deployment.”",
    ],
    teamNotes: [
      "Avg sales cycle 11 months and rising",
      "Capex per site $4.2M",
      "Deployment crew bottlenecked at 3 sites/quarter",
    ],
    founderQuote: "“The science is solved. The procurement process is the moat we’re fighting.”",
    investorPressure: "Climate investors questioning capital efficiency vs deployment velocity.",
    boardTags: ["Procurement drag", "Capex intensity", "Deployment throughput"],
    operationalMetrics: [
      { label: "Pilot → contract", value: "11 mo", trend: "up" },
      { label: "Capex / site", value: "$4.2M", trend: "up" },
      { label: "Sites live / Q", value: "3", trend: "flat" },
    ],
  },
  solvix: {
    problem:
      "Solvix Energy expanded rapidly over the last year after signing multiple enterprise contracts for its AI-managed solar storage infrastructure platform. Although revenue growth remains strong and enterprise demand continues increasing, operational profitability has steadily declined. Infrastructure maintenance costs increased sharply over the past two quarters, customer support escalations doubled, and several enterprise customers reported inconsistent optimization performance across energy grids.",
    rootCauseLabel: "Rapid scaling without infrastructure maturity and operational reliability",
    keywords: ["reliability", "infrastructure", "maintenance", "scaling", "operational", "maturity", "uptime", "sre"],
    revenue: [55, 72, 90, 110, 130, 150],
    burn: [60, 75, 92, 115, 140, 168],
    retention: [94, 92, 89, 86, 82, 79],
    customerVoices: [
      "“Optimization performance varies by grid.”",
      "“Support tickets take 4 days to triage.”",
      "“We bought scale; we got instability.”",
    ],
    teamNotes: [
      "Maintenance cost / site +62% YoY",
      "Support escalations 2.1x in 2 quarters",
      "No dedicated SRE / reliability function",
    ],
    founderQuote: "“We shipped contracts faster than we shipped reliability.”",
    investorPressure: "Margins compressing — board questioning long-term sustainability.",
    boardTags: ["Reliability debt", "Margin compression", "Operational immaturity"],
    operationalMetrics: [
      { label: "Gross margin", value: "31%", trend: "down" },
      { label: "Maintenance cost / site", value: "+62%", trend: "up" },
      { label: "P1 escalations", value: "2.1x", trend: "up" },
    ],
  },
  ecobyte: {
    problem:
      "EcoByte initially experienced rapid enterprise adoption as ESG reporting requirements increased across large corporations. However, despite continued market interest in sustainability analytics, new customer acquisition slowed significantly this quarter and churn among mid-sized enterprise clients increased. Sales teams report that customers increasingly compare EcoByte against lower-cost competitors offering similar reporting features.",
    rootCauseLabel: "Weak differentiation and declining perceived value in a crowded SaaS market",
    keywords: ["differentiation", "positioning", "value", "commoditization", "competitive", "wedge", "moat"],
    revenue: [60, 78, 92, 100, 102, 100],
    burn: [70, 78, 86, 92, 96, 100],
    retention: [90, 88, 86, 83, 80, 76],
    customerVoices: [
      "“Half the price elsewhere for the same dashboard.”",
      "“Not sure what your advanced analytics actually do.”",
      "“We renewed for compliance, not for value.”",
    ],
    teamNotes: [
      "Win rate vs competitors: 38% → 22%",
      "Advanced module usage: 14%",
      "Avg ACV ↓ 17% YoY",
    ],
    founderQuote: "“We’re shipping features the market already considers table stakes.”",
    investorPressure: "Board wants a clear wedge before next raise.",
    boardTags: ["Commoditization", "Weak positioning", "Underused product depth"],
    operationalMetrics: [
      { label: "Win rate", value: "22%", trend: "down" },
      { label: "Advanced feature usage", value: "14%", trend: "down" },
      { label: "Mid-market churn", value: "11%", trend: "up" },
    ],
  },
  windsync: {
    problem:
      "WindSync secured multiple large infrastructure partnerships this year, significantly increasing projected annual revenue and investor confidence. However, despite strong commercial traction, project deployment timelines have nearly doubled over the last two quarters. Internal operations reports show increasing delays in infrastructure implementation, field engineering coordination, and deployment approvals across enterprise partners.",
    rootCauseLabel: "Infrastructure implementation complexity and immature operational scaling systems",
    keywords: ["implementation", "operations", "scaling", "systems", "field", "process", "coordination"],
    revenue: [50, 70, 88, 100, 112, 122],
    burn: [55, 70, 88, 105, 122, 140],
    retention: [92, 92, 92, 92, 91, 91],
    customerVoices: [
      "“Approval handoffs between teams keep slipping.”",
      "“Field crews booked 10 weeks out.”",
      "“We expected go-live in 3 months, currently at 7.”",
    ],
    teamNotes: [
      "Avg deployment cycle 4 → 7 months",
      "Cross-team handoffs ungoverned",
      "Field PM headcount flat while contracts 3x",
    ],
    founderQuote: "“We out-sold our operations.”",
    investorPressure: "LPs asking how scaling will support 2x contract pipeline.",
    boardTags: ["Process immaturity", "Field bottleneck", "Coordination drag"],
    operationalMetrics: [
      { label: "Avg deployment cycle", value: "7 mo", trend: "up" },
      { label: "Field PM utilization", value: "112%", trend: "up" },
      { label: "Pipeline → live", value: "31%", trend: "down" },
    ],
  },
  pulsetrack: {
    problem:
      "PulseTrack successfully expanded into several hospital networks this quarter, leading to strong enterprise growth and positive investor attention. However, despite increased hospital adoption, physician engagement with the platform has steadily declined. Doctors are dismissing alerts more frequently, session durations dropped significantly, and hospital administrators reported concerns regarding workflow fatigue.",
    rootCauseLabel: "Workflow fatigue and poor workflow integration",
    keywords: ["workflow", "integration", "alert", "fatigue", "adoption", "clinical", "ehr"],
    revenue: [60, 78, 95, 110, 122, 130],
    burn: [55, 65, 75, 82, 88, 94],
    retention: [96, 95, 92, 88, 84, 80],
    customerVoices: [
      "“We get 40+ alerts per shift — most are noise.”",
      "“It’s another tab, not part of my workflow.”",
      "“EHR integration is shallow.”",
    ],
    teamNotes: [
      "Alert dismissal rate 41% → 67%",
      "Avg session 4.2 → 1.6 min",
      "EHR-native integration only at 2 of 18 networks",
    ],
    founderQuote: "“The product is right; the workflow placement is wrong.”",
    investorPressure: "Adoption metrics weakening despite enterprise wins.",
    boardTags: ["Alert fatigue", "Workflow misfit", "Shallow integration"],
    operationalMetrics: [
      { label: "Alert dismissal", value: "67%", trend: "up" },
      { label: "Avg session length", value: "1.6 min", trend: "down" },
      { label: "EHR-native sites", value: "2 / 18", trend: "down" },
    ],
  },
  nanocure: {
    problem:
      "NanoCure Labs continues receiving strong investor attention after recent clinical breakthroughs. Despite scientific progress, commercial partnerships with pharmaceutical companies continue facing delays, procurement timelines are increasing, and the startup’s burn rate has accelerated significantly.",
    rootCauseLabel: "Commercialization and healthcare procurement bottlenecks",
    keywords: ["commercialization", "procurement", "partnerships", "pharma", "regulatory", "go-to-market", "gtm"],
    revenue: [40, 50, 60, 68, 72, 75],
    burn: [80, 100, 122, 148, 172, 200],
    retention: [90, 90, 89, 88, 87, 86],
    customerVoices: [
      "“Procurement needs 18-month evaluation cycles.”",
      "“Science is impressive; commercial pathway unclear.”",
      "“We need a pharma co-development partner first.”",
    ],
    teamNotes: [
      "Burn 2.5x in 4 quarters",
      "No dedicated commercialization lead",
      "Pharma BD cycle averaging 14 months",
    ],
    founderQuote: "“We assumed validation would pull the market — it hasn’t.”",
    investorPressure: "Investors increasingly concerned about commercialization timeline vs capital consumption.",
    boardTags: ["Commercialization gap", "Pharma BD drag", "Burn acceleration"],
    operationalMetrics: [
      { label: "Pharma BD cycle", value: "14 mo", trend: "up" },
      { label: "Monthly burn", value: "$480K", trend: "up" },
      { label: "Signed partnerships", value: "0", trend: "flat" },
    ],
  },
};

/** Get RCA case for a startup. Falls back to a generic case generated from risks. */
export function getRcaCase(startup: Startup): RcaCase {
  if (cases[startup.id]) return cases[startup.id];
  return {
    problem: `${startup.name} has shown initial traction within ${startup.tagline.toLowerCase()} However, over the past two quarters, growth has slowed and several operational concerns have surfaced: ${startup.risks.join("; ")}. The leadership team is debating whether to double down on growth or stabilize operations first. Investors are watching closely.`,
    rootCauseLabel: startup.risks[0] ?? "Operational and strategic bottleneck",
    keywords: startup.risks
      .join(" ")
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((w) => w.length > 5)
      .slice(0, 8),
    revenue: [40, 55, 70, 80, 82, 80],
    burn: [50, 60, 72, 84, 96, 108],
    retention: [92, 90, 88, 85, 82, 80],
    customerVoices: [
      "“The product works — but scaling our usage has been hard.”",
      "“We need better support and clearer ROI.”",
    ],
    teamNotes: [
      "Operational headcount lagging contract pipeline",
      "Process maturity behind growth velocity",
    ],
    founderQuote: "“We grew faster than the systems supporting us.”",
    investorPressure: "Board reviewing capital efficiency and operational sustainability.",
    boardTags: ["Scaling friction", "Operational drag"],
    operationalMetrics: [
      { label: "Growth (Q-o-Q)", value: "+8%", trend: "down" },
      { label: "Burn multiple", value: "3.4x", trend: "up" },
      { label: "Retention", value: "82%", trend: "down" },
    ],
  };
}