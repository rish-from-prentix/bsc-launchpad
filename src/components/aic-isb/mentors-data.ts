import type { ThemeId } from "./startups-data";

export type Mentor = {
  id: string;
  name: string;
  initials: string;
  role: string;
  prevExperience: string[];
  years: number;
  expertise: string[];
  bestFor: string[]; // startup ids
  notIdealFor: string;
  style: string;
  feedback: string;
  philosophy: string;
  sector: ThemeId;
};

const ai: Mentor[] = [
  {
    id: "rajiv-malhotra",
    name: "Rajiv Malhotra",
    initials: "RM",
    role: "Advisor to enterprise SaaS startups",
    prevExperience: [
      "Former VP Enterprise Sales at Freshworks",
      "Built APAC enterprise sales teams across 11 countries",
      "Helped scale SaaS revenue from $8M → $120M ARR",
    ],
    years: 18,
    expertise: [
      "Enterprise GTM",
      "SaaS scaling",
      "International expansion",
      "Revenue operations",
      "Sales optimization",
    ],
    bestFor: ["neuralforge", "quantedge", "synapseflow"],
    notIdealFor: "Consumer-first startups",
    style: "Execution-heavy and metrics-driven",
    feedback: "Rajiv helped us reduce enterprise sales cycles by nearly 40%.",
    philosophy: "Founders often mistake growth for scalability.",
    sector: "ai",
  },
  {
    id: "meera-khanna",
    name: "Dr. Meera Khanna",
    initials: "MK",
    role: "Healthcare AI advisor and clinical systems strategist",
    prevExperience: [
      "AI Research Lead at NVIDIA Health",
      "Advisor to multiple HealthTech startups",
      "Clinical AI systems researcher",
    ],
    years: 14,
    expertise: [
      "Healthcare AI deployment",
      "Clinical compliance",
      "AI productization",
      "Medical workflows",
    ],
    bestFor: ["medpredict", "visionpilot"],
    notIdealFor: "Fast-moving consumer startups",
    style: "Analytical and product-focused",
    feedback: "Meera completely changed how we approached healthcare compliance.",
    philosophy: "In healthcare, trust scales slower than technology.",
    sector: "ai",
  },
  {
    id: "kunal-shahani",
    name: "Kunal Shahani",
    initials: "KS",
    role: "Consumer AI growth advisor",
    prevExperience: [
      "Built and exited 2 AI consumer apps",
      "Growth advisor to Gen Z-focused products",
    ],
    years: 11,
    expertise: ["Viral acquisition", "Consumer retention", "Product engagement", "Growth loops"],
    bestFor: ["echomind", "scriptly"],
    notIdealFor: "Enterprise DeepTech startups",
    style: "Fast-moving and experimentation-focused",
    feedback: "Kunal understands retention better than almost anyone.",
    philosophy: "Retention is the only growth metric that matters long term.",
    sector: "ai",
  },
  {
    id: "priya-sethi",
    name: "Priya Sethi",
    initials: "PS",
    role: "Startup operations scaling consultant",
    prevExperience: [
      "Former operations leader at Uber India",
      "Scaled onboarding systems across 40+ cities",
      "Worked on Stripe scaling initiatives",
    ],
    years: 16,
    expertise: [
      "Operational scaling",
      "Process optimization",
      "Marketplace systems",
      "Implementation workflows",
    ],
    bestFor: ["neuralforge", "visionpilot", "atlasmind"],
    notIdealFor: "Scientific R&D-heavy startups",
    style: "Execution-oriented and systematic",
    feedback: "Priya identified scaling issues we didn’t even realize existed.",
    philosophy: "Operational debt kills startups faster than competition.",
    sector: "ai",
  },
  {
    id: "arvind-narang",
    name: "Arvind Narang",
    initials: "AN",
    role: "Partner at DeepTech Ventures",
    prevExperience: [
      "Led investments into robotics and AI startups",
      "Former McKinsey DeepTech consultant",
    ],
    years: 20,
    expertise: [
      "DeepTech fundraising",
      "Robotics commercialization",
      "Investor strategy",
      "Enterprise scaling",
    ],
    bestFor: ["atlasmind", "medpredict"],
    notIdealFor: "Consumer engagement businesses",
    style: "Strategic and investor-oriented",
    feedback: "Arvind pushed us to think beyond short-term revenue.",
    philosophy: "DeepTech wins through defensibility, not speed.",
    sector: "ai",
  },
];

const climate: Mentor[] = [
  {
    id: "neha-kapoor",
    name: "Neha Kapoor",
    initials: "NK",
    role: "Independent Climate Infrastructure Advisor",
    prevExperience: [
      "Former Sustainability Head at Tesla Energy APAC",
      "Led renewable energy deployment partnerships across Southeast Asia",
      "Worked with governments and industrial manufacturers on clean energy transitions",
      "Advisor to multiple clean infrastructure startups",
    ],
    years: 19,
    expertise: [
      "Clean energy scaling",
      "Renewable infrastructure deployment",
      "Sustainability partnerships",
      "Energy transition operations",
      "Enterprise sustainability strategy",
    ],
    bestFor: ["solvix", "windsync", "carbonloop"],
    notIdealFor: "Consumer sustainability products",
    style: "Strategic and systems-oriented. Pushes founders toward infrastructure resilience.",
    feedback: "Neha helped us restructure our deployment strategy before expansion became unmanageable.",
    philosophy:
      "Climate startups don’t fail because demand is weak — they fail because infrastructure scaling is underestimated.",
    sector: "climate",
  },
  {
    id: "vikram-desai",
    name: "Vikram Desai",
    initials: "VD",
    role: "Partner at EarthScale Ventures",
    prevExperience: [
      "Early investor in multiple ClimateTech unicorns",
      "Former advisor to India’s renewable policy taskforce",
      "Led investments in energy, carbon capture, and industrial decarbonization",
    ],
    years: 21,
    expertise: [
      "Climate fundraising",
      "Industrial sustainability",
      "Government policy navigation",
      "Enterprise climate partnerships",
      "Infrastructure financing",
    ],
    bestFor: ["carbonloop", "terrafuel", "solvix"],
    notIdealFor: "Small SaaS-first climate products",
    style: "High-pressure and investor-focused. Pushes toward long-term capital efficiency.",
    feedback: "Vikram completely changed how we approached infrastructure financing.",
    philosophy: "Climate infrastructure is won through patience, partnerships, and policy alignment.",
    sector: "climate",
  },
  {
    id: "sarah-iyer",
    name: "Sarah Iyer",
    initials: "SI",
    role: "Enterprise ESG SaaS Operator & GTM Advisor",
    prevExperience: [
      "Former VP Operations at a global ESG analytics platform",
      "Helped scale enterprise sustainability software across Fortune 500 clients",
      "Built onboarding systems for enterprise reporting tools",
    ],
    years: 15,
    expertise: [
      "ESG analytics",
      "Enterprise SaaS onboarding",
      "Customer success systems",
      "B2B implementation scaling",
      "Sustainability reporting",
    ],
    bestFor: ["ecobyte", "greenchain"],
    notIdealFor: "Heavy industrial infrastructure startups",
    style: "Operational and detail-oriented. Focuses on customer workflows and retention.",
    feedback: "Sarah identified why enterprise onboarding was becoming our biggest churn risk.",
    philosophy: "Enterprise software scales through process clarity, not feature quantity.",
    sector: "climate",
  },
  {
    id: "rohit-menon",
    name: "Rohit Menon",
    initials: "RN",
    role: "Infrastructure & Supply Chain Scaling Consultant",
    prevExperience: [
      "Former logistics operations leader at Siemens Infrastructure",
      "Managed large-scale infrastructure deployment projects across India and the Middle East",
      "Worked on industrial automation and energy logistics systems",
    ],
    years: 17,
    expertise: [
      "Infrastructure deployment",
      "Industrial logistics",
      "Supply chain optimization",
      "Operational scaling",
      "Field implementation systems",
    ],
    bestFor: ["windsync", "aquagrid", "carbonloop"],
    notIdealFor: "Research-heavy biotech climate startups",
    style: "Execution-focused and operations-heavy. Prioritizes efficiency over expansion.",
    feedback: "Rohit helped us identify operational bottlenecks before they became expensive failures.",
    philosophy: "Operational complexity compounds faster than founders expect.",
    sector: "climate",
  },
  {
    id: "elena-verma",
    name: "Dr. Elena Verma",
    initials: "EV",
    role: "Agricultural Sustainability Scientist & Rural Innovation Advisor",
    prevExperience: [
      "Led regenerative agriculture initiatives across rural India",
      "Advisor to agri-sustainability startups and NGOs",
      "Worked extensively on farmer adoption and sustainable farming systems",
    ],
    years: 18,
    expertise: [
      "Regenerative agriculture",
      "Rural adoption systems",
      "Sustainability implementation",
      "AgriTech scaling",
      "Community engagement",
    ],
    bestFor: ["puresoil"],
    notIdealFor: "Urban enterprise SaaS startups",
    style: "Field-oriented and adoption-focused. Emphasis on behavioral adoption and trust.",
    feedback: "Elena helped us realize adoption barriers were more behavioral than technical.",
    philosophy: "In sustainability, adoption matters more than innovation.",
    sector: "climate",
  },
];

const health: Mentor[] = [
  {
    id: "aisha-menon",
    name: "Dr. Aisha Menon",
    initials: "AM",
    role: "Healthcare Systems & Clinical Operations Advisor",
    prevExperience: [
      "Former Mayo Clinic Digital Health Lead",
      "Designed hospital workflow systems for large healthcare networks",
      "Advisor to hospital automation and diagnostics startups",
    ],
    years: 20,
    expertise: [
      "Clinical adoption",
      "Hospital workflows",
      "Healthcare systems integration",
      "Physician engagement",
      "Operational healthcare scaling",
    ],
    bestFor: ["pulsetrack", "caresync", "medpredict"],
    notIdealFor: "Consumer wellness startups",
    style: "Structured and systems-focused. Emphasis on workflow practicality.",
    feedback: "Aisha helped us understand why doctors resisted our product despite strong technology.",
    philosophy: "In healthcare, workflow friction destroys adoption faster than bad technology.",
    sector: "health",
  },
  {
    id: "rohan-bedi",
    name: "Rohan Bedi",
    initials: "RB",
    role: "Partner at MedScale Ventures",
    prevExperience: [
      "Early-stage investor in HealthTech and diagnostics startups",
      "Former healthcare strategy consultant",
      "Worked on scaling telemedicine and diagnostics platforms across APAC",
    ],
    years: 16,
    expertise: [
      "Healthcare fundraising",
      "Growth strategy",
      "Market expansion",
      "Investor positioning",
      "Healthcare commercialization",
    ],
    bestFor: ["medilink", "nanocure", "pulsetrack"],
    notIdealFor: "Scientific R&D-heavy biotech startups",
    style: "Growth-oriented and commercially strategic",
    feedback: "Rohan helped us reposition our business for enterprise healthcare buyers.",
    philosophy:
      "Healthcare startups don’t scale when products improve — they scale when trust improves.",
    sector: "health",
  },
  {
    id: "karan-kapoor",
    name: "Dr. Karan Kapoor",
    initials: "KK",
    role: "Biotech Commercialization & Pharma Partnerships Advisor",
    prevExperience: [
      "Former commercialization lead at Novartis",
      "Worked on pharma partnerships and drug deployment strategies",
      "Advisor to biotech and genomics startups",
    ],
    years: 22,
    expertise: [
      "Pharma partnerships",
      "Drug commercialization",
      "Regulatory approvals",
      "Clinical trials",
      "Enterprise healthcare partnerships",
    ],
    bestFor: ["biopulse", "geneticore", "nanocure"],
    notIdealFor: "Fast-moving consumer health apps",
    style: "Analytical and deeply strategic. Long-term commercialization planning.",
    feedback: "Karan forced us to think about commercialization years before launch.",
    philosophy: "In biotech, commercialization is usually harder than innovation.",
    sector: "health",
  },
  {
    id: "shreya-nair",
    name: "Shreya Nair",
    initials: "SN",
    role: "Consumer Wellness Product Strategist",
    prevExperience: [
      "Former retention lead at multiple wellness startups",
      "Specialized in habit formation and subscription engagement",
      "Worked on mental wellness and wearable product adoption",
    ],
    years: 12,
    expertise: [
      "User engagement",
      "Habit formation",
      "Subscription retention",
      "Consumer wellness products",
      "Product psychology",
    ],
    bestFor: ["healmate", "vitasense"],
    notIdealFor: "Enterprise healthcare systems",
    style: "Behavior-driven and product-centric",
    feedback: "Shreya completely reframed how we thought about long-term engagement.",
    philosophy: "People don’t abandon products because they’re bad — they abandon habits that never formed.",
    sector: "health",
  },
  {
    id: "ethan-roy",
    name: "Dr. Ethan Roy",
    initials: "ER",
    role: "AI Healthcare Infrastructure Advisor",
    prevExperience: [
      "Former AI systems architect for healthcare networks",
      "Worked on diagnostics infrastructure and healthcare data systems",
      "Advisor to AI diagnostics and clinical automation startups",
    ],
    years: 19,
    expertise: [
      "AI diagnostics",
      "Healthcare infrastructure",
      "Clinical AI systems",
      "Data interoperability",
      "Healthcare scalability",
    ],
    bestFor: ["nanocure", "pulsetrack", "medpredict"],
    notIdealFor: "Consumer wellness apps",
    style: "Technical and systems-oriented. Pushes toward scalable infrastructure thinking.",
    feedback: "Ethan helped us redesign our entire healthcare data architecture.",
    philosophy: "Healthcare AI succeeds when infrastructure becomes invisible.",
    sector: "health",
  },
];

export const MENTORS: Record<ThemeId, Mentor[]> = { ai, climate, health };

export function mentorsForSector(sector: ThemeId): Mentor[] {
  return MENTORS[sector];
}

/** Strong = mentor lists this startup id in their `bestFor`. */
export function mentorFit(mentor: Mentor, startupId: string): "strong" | "weak" {
  return mentor.bestFor.includes(startupId) ? "strong" : "weak";
}

export function getMentor(sector: ThemeId, id: string): Mentor | undefined {
  return MENTORS[sector].find((m) => m.id === id);
}