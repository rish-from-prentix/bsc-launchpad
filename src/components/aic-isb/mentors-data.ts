import type { ThemeId } from "./startups-data";

export type Mentor = {
  id: string;
  name: string;
  initials: string;
  role: string;
  years: number;
  sector: ThemeId;
  // Rich profile
  journey: string;            // "Their journey" , 2–3 sentence career story
  addsValue: string[];        // 3 bullets , where they add most value
  mayStruggle: string[];      // 3 bullets , where they may struggle
  honestCaveat: string;       // amber callout sentence
  strongFitTags: string[];    // "Strong fit when a startup needs:"
  lessUsefulTags: string[];   // "Less useful when a startup needs:"
  founderQuote: string;       // verbatim quote
  quoteContext: string;       // small grey context line under quote
  expertise: string[];        // legacy tags
  bestFor: string[];          // startup ids , drives fit scoring
};

const ai: Mentor[] = [
  {
    id: "rajiv-malhotra",
    name: "Rajiv Malhotra",
    initials: "RM",
    role: "Enterprise SaaS GTM advisor",
    years: 18,
    sector: "ai",
    journey:
      "Rajiv spent 18 years building and leading enterprise sales teams inside companies that already had product-market fit. He is exceptional at turning a working GTM motion into a repeatable, scalable machine. He has never had to find the first 10 customers from scratch.",
    addsValue: [
      "Turning a working sales motion into a repeatable, scalable machine",
      "Building enterprise sales teams across geographies",
      "Compressing long enterprise sales cycles with discipline and process",
    ],
    mayStruggle: [
      "Helping founders find their first 10 customers from a cold start",
      "Pivoting the core value proposition when the ICP is still unclear",
      "Operating with zero brand recognition and no inbound demand",
    ],
    honestCaveat:
      "Rajiv's playbook is built for companies that already know what they're selling and to whom. If a founder is still figuring out their ICP, his frameworks may feel like they're skipping several steps.",
    strongFitTags: ["Enterprise GTM scaling", "Repeatable sales motion", "International expansion"],
    lessUsefulTags: ["First customer discovery", "Pre-revenue ICP search", "Core product pivots"],
    founderQuote: "Rajiv helped us reduce enterprise sales cycles by nearly 40%.",
    quoteContext:
      "This founder had already closed early enterprise deals and needed help making the motion repeatable , different from cold-start customer discovery.",
    expertise: ["Enterprise GTM", "SaaS scaling", "International expansion", "Revenue operations"],
    bestFor: ["neuralforge", "quantedge", "synapseflow"],
  },
  {
    id: "meera-khanna",
    name: "Dr. Meera Khanna",
    initials: "MK",
    role: "Healthcare AI advisor and clinical systems strategist",
    years: 14,
    sector: "ai",
    journey:
      "Meera has spent her career inside large research and healthcare AI organisations , NVIDIA, academic institutions, established clinical systems. She understands how AI gets deployed inside complex organisations. She has not personally run a startup with limited runway and a small team.",
    addsValue: [
      "Navigating clinical compliance and validation pathways",
      "Designing AI products that fit institutional buyer expectations",
      "Building credibility with hospital and research stakeholders",
    ],
    mayStruggle: [
      "Operating under cash pressure with weekly runway decisions",
      "Iterating fast on product when the team is three people",
      "Making bold commercial calls without full clinical validation",
    ],
    honestCaveat:
      "Meera thinks in research timelines and institutional compliance cycles. An early-stage founder under cash pressure may find her advice thorough but slow to apply.",
    strongFitTags: ["Clinical AI deployment", "Institutional credibility", "Compliance navigation"],
    lessUsefulTags: ["Rapid iteration cycles", "Cash-constrained decisions", "Unregulated experimentation"],
    founderQuote: "Meera completely changed how we approached healthcare compliance.",
    quoteContext:
      "This founder was already inside hospital pilots and needed institutional rigour , different from a pre-pilot team racing on runway.",
    expertise: ["Healthcare AI", "Clinical compliance", "AI productization", "Medical workflows"],
    bestFor: ["medpredict", "visionpilot"],
  },
  {
    id: "kunal-shahani",
    name: "Kunal Shahani",
    initials: "KS",
    role: "Consumer AI founder, two exits",
    years: 11,
    sector: "ai",
    journey:
      "Kunal built two consumer AI apps from zero and sold them. He has personally experienced not knowing if the product would work, running on tight budgets, and making calls with incomplete data. He is one of the few mentors on this list with genuine 0→1 experience.",
    addsValue: [
      "Living the ambiguity of pre-product-market-fit consumer building",
      "Designing viral loops and retention systems on a tight budget",
      "Making fast calls with incomplete data , and recovering from wrong ones",
    ],
    mayStruggle: [
      "Navigating enterprise procurement and institutional sales cycles",
      "Managing regulated buyers with multi-stakeholder approvals",
      "Building long-cycle B2B partnerships",
    ],
    honestCaveat:
      "Kunal's strengths are in consumer engagement and viral loops. If a startup is selling to enterprises or navigating institutional buyers, his instincts may not map cleanly to the sales cycle.",
    strongFitTags: ["0→1 consumer building", "Viral acquisition", "Scrappy experimentation"],
    lessUsefulTags: ["Enterprise procurement", "Regulated sales cycles", "Long B2B partnerships"],
    founderQuote: "Kunal understands retention better than almost anyone.",
    quoteContext:
      "This founder was running a consumer app where daily engagement was the entire business , his instincts mapped perfectly.",
    expertise: ["Viral acquisition", "Consumer retention", "Product engagement", "Growth loops"],
    bestFor: ["echomind", "scriptly"],
  },
  {
    id: "priya-sethi",
    name: "Priya Sethi",
    initials: "PS",
    role: "Operations scaling consultant",
    years: 16,
    sector: "ai",
    journey:
      "Priya scaled operations at Uber and Stripe , both companies that already had strong product-market fit and significant capital. She is world-class at building systems, processes, and workflows at scale. She has not experienced the ambiguity of building before the model is proven.",
    addsValue: [
      "Bringing order to fast-growing teams that are already winning",
      "Designing process for marketplaces and high-volume workflows",
      "Building operational systems that don't break under growth",
    ],
    mayStruggle: [
      "Helping founders who haven't yet found repeatable revenue",
      "Working in environments where the business model is still shifting",
      "Replacing early-sales hustle with process when sales hasn't been figured out",
    ],
    honestCaveat:
      "Priya's superpower is bringing order to chaos that already has direction. If the startup hasn't yet found what it's optimising for, her process-heavy approach may feel premature.",
    strongFitTags: ["Operational scaling", "Process design at growth", "Marketplace ops"],
    lessUsefulTags: ["Pre-PMF experimentation", "Early sales hustle", "Business model search"],
    founderQuote: "Priya identified scaling issues we didn't even realise existed.",
    quoteContext:
      "This founder already had repeatable revenue and was breaking under their own growth , exactly the stage Priya's systems were built for.",
    expertise: ["Operational scaling", "Process optimization", "Marketplace systems", "Implementation workflows"],
    bestFor: ["neuralforge", "visionpilot", "atlasmind"],
  },
  {
    id: "arvind-narang",
    name: "Arvind Narang",
    initials: "AN",
    role: "Partner at DeepTech Ventures",
    years: 20,
    sector: "ai",
    journey:
      "Arvind has spent two decades evaluating and investing in DeepTech startups as a partner and consultant. He understands what makes a DeepTech company fundable and defensible. He has advised from the outside , he has not personally been a founder building with limited resources.",
    addsValue: [
      "Sharpening defensibility, moats, and long-term strategic positioning",
      "Preparing DeepTech companies for institutional fundraising",
      "Reading the market for what investors will value 12–24 months out",
    ],
    mayStruggle: [
      "Hands-on product or GTM execution at pre-Series A stage",
      "Day-to-day operational decisions when runway is short",
      "Helping founders survive the next 90 days, not just win the next decade",
    ],
    honestCaveat:
      "Arvind sees startups through an investor lens , defensibility, moats, long-term positioning. Founders in the earliest stages sometimes need someone who can help them survive the next 90 days, not just win the next decade.",
    strongFitTags: ["Investor positioning", "DeepTech defensibility", "Series A readiness"],
    lessUsefulTags: ["Hands-on execution", "Pre-Series A operations", "Day-to-day product calls"],
    founderQuote: "Arvind pushed us to think beyond short-term revenue.",
    quoteContext:
      "This founder was preparing for institutional fundraising and needed long-horizon framing , different from a pre-seed team focused on survival.",
    expertise: ["DeepTech fundraising", "Robotics commercialization", "Investor strategy", "Enterprise scaling"],
    bestFor: ["atlasmind", "medpredict"],
  },
];

const climate: Mentor[] = [
  {
    id: "neha-kapoor",
    name: "Neha Kapoor",
    initials: "NK",
    role: "Independent climate infrastructure advisor",
    years: 19,
    sector: "climate",
    journey:
      "Neha led sustainability and renewable energy deployment at Tesla Energy APAC , a company with enormous resources, established partnerships, and government relationships already in place. She knows how to scale clean energy infrastructure when the rails already exist.",
    addsValue: [
      "Scaling clean energy deployment across geographies",
      "Structuring enterprise sustainability partnerships",
      "Navigating government and utility relationships at scale",
    ],
    mayStruggle: [
      "Helping a pre-pilot startup get its first deployment off the ground",
      "Building partnerships from scratch without an established brand behind them",
      "Operating in resource-constrained environments without playbooks",
    ],
    honestCaveat:
      "Neha's experience is in deploying at scale inside resource-rich organisations. An early-stage climate startup trying to get its first pilot off the ground is operating in a very different environment , one she hasn't personally navigated.",
    strongFitTags: ["Infrastructure scaling", "Enterprise sustainability partnerships", "Utility-grade deployment"],
    lessUsefulTags: ["First pilot acquisition", "Scrappy zero-budget GTM", "Building brand from zero"],
    founderQuote: "Neha helped us restructure our deployment strategy before expansion became unmanageable.",
    quoteContext:
      "This founder already had paying enterprise pilots and was scaling deployment , a different stage from pre-pilot teams.",
    expertise: ["Clean energy scaling", "Renewable infrastructure", "Sustainability partnerships"],
    bestFor: ["solvix", "windsync", "carbonloop"],
  },
  {
    id: "vikram-desai",
    name: "Vikram Desai",
    initials: "VD",
    role: "Partner at EarthScale Ventures",
    years: 21,
    sector: "climate",
    journey:
      "Vikram has been an investor and policy advisor in climate for over two decades. He has seen hundreds of climate startups succeed and fail, and he understands the capital and policy landscape deeply. He has never personally built a climate company under founder-level pressure.",
    addsValue: [
      "Navigating climate fundraising and capital structures",
      "Reading policy shifts and aligning startups to them early",
      "Pattern-matching across hundreds of climate startup trajectories",
    ],
    mayStruggle: [
      "Operational guidance for small teams under daily pressure",
      "Pre-fundraising execution focused on building the product",
      "Tactical day-to-day support when the team is two co-founders",
    ],
    honestCaveat:
      "Vikram's advice is excellent for founders who need to navigate fundraising and policy , but his perspective is always from the other side of the table. He may underestimate how hard execution feels from inside a small team.",
    strongFitTags: ["Climate fundraising", "Policy alignment", "Capital structure"],
    lessUsefulTags: ["Operational execution", "Pre-fundraising product work", "Tactical day-to-day support"],
    founderQuote: "Vikram completely changed how we approached infrastructure financing.",
    quoteContext:
      "This founder was raising a growth round for capital-intensive infrastructure , Vikram's investor lens was exactly the gap.",
    expertise: ["Climate fundraising", "Industrial sustainability", "Government policy navigation"],
    bestFor: ["carbonloop", "terrafuel", "solvix"],
  },
  {
    id: "sarah-iyer",
    name: "Sarah Iyer",
    initials: "SI",
    role: "Enterprise ESG SaaS operator and GTM advisor",
    years: 15,
    sector: "climate",
    journey:
      "Sarah scaled enterprise ESG software inside an already-established platform with Fortune 500 clients. She built onboarding and customer success systems for a product that already had buyers. She understands enterprise SaaS operations extremely well but has not started from zero.",
    addsValue: [
      "Designing enterprise onboarding and CS systems that retain accounts",
      "Reducing churn in complex enterprise sustainability workflows",
      "Building reporting and implementation playbooks that scale",
    ],
    mayStruggle: [
      "Helping founders win their very first enterprise customer",
      "Defining the product when the buyer doesn't yet exist",
      "Pre-enterprise traction work that precedes onboarding entirely",
    ],
    honestCaveat:
      "Sarah's frameworks assume you already have enterprise customers to onboard. If a startup is still convincing its first enterprise buyer to take a meeting, her operational systems may be getting ahead of where the business actually is.",
    strongFitTags: ["Enterprise onboarding", "Customer success systems", "Churn reduction"],
    lessUsefulTags: ["First enterprise sale", "Product definition", "Early sales hustle"],
    founderQuote: "Sarah identified why enterprise onboarding was becoming our biggest churn risk.",
    quoteContext:
      "This founder had signed Fortune 500 logos and was losing them , the operational gap was exactly Sarah's wheelhouse.",
    expertise: ["ESG analytics", "Enterprise SaaS onboarding", "Customer success systems"],
    bestFor: ["ecobyte", "greenchain"],
  },
  {
    id: "rohit-menon",
    name: "Rohit Menon",
    initials: "RN",
    role: "Infrastructure & supply chain scaling consultant",
    years: 17,
    sector: "climate",
    journey:
      "Rohit spent 17 years managing large-scale infrastructure projects at Siemens , complex, multi-stakeholder, heavily resourced deployments. He is exceptional at making big systems run efficiently. He has not operated in the scrappy, low-resource environment of an early-stage startup.",
    addsValue: [
      "Designing reliable industrial deployment processes",
      "Managing multi-stakeholder infrastructure projects",
      "Optimising supply chains and vendor coordination at scale",
    ],
    mayStruggle: [
      "Working with startups that don't yet have vendor relationships",
      "Improvising creative low-cost solutions outside enterprise playbooks",
      "Pre-deployment teams without proven supply-chain partners",
    ],
    honestCaveat:
      "Rohit's mental model is built around established supply chains, vendor relationships, and project management at scale. A startup that is still figuring out its first deployment partner may find his frameworks hard to apply with limited resources.",
    strongFitTags: ["Industrial deployment", "Supply chain scaling", "Vendor coordination"],
    lessUsefulTags: ["Pre-deployment partner search", "Low-budget improvisation", "Pre-vendor stage"],
    founderQuote: "Rohit helped us identify operational bottlenecks before they became expensive failures.",
    quoteContext:
      "This founder was already deploying with industrial partners , Rohit's enterprise-grade frameworks landed cleanly.",
    expertise: ["Infrastructure deployment", "Industrial logistics", "Supply chain optimization"],
    bestFor: ["windsync", "aquagrid", "carbonloop"],
  },
  {
    id: "elena-verma",
    name: "Dr. Elena Verma",
    initials: "EV",
    role: "Agricultural sustainability scientist & rural innovation advisor",
    years: 18,
    sector: "climate",
    journey:
      "Elena has spent 18 years in the field , working directly with farming communities, rural NGOs, and agricultural sustainability programmes. She has genuine zero-to-one experience in adoption challenges. She understands what it feels like to convince someone to change behaviour with no budget and no brand recognition.",
    addsValue: [
      "Driving adoption in low-trust, low-budget rural environments",
      "Designing community-led implementation programmes",
      "Bridging scientific rigour with on-the-ground behaviour change",
    ],
    mayStruggle: [
      "Urban enterprise GTM and B2B sales motions",
      "Industrial sustainability buyers and procurement cycles",
      "Fundraising and investor positioning for venture-scale companies",
    ],
    honestCaveat:
      "Elena's depth is in rural and agricultural contexts. If a startup is building for urban enterprises or industrial sustainability, her community-oriented instincts may not map to the sales and scaling challenges at hand.",
    strongFitTags: ["Rural adoption", "Behaviour-change implementation", "Community-led GTM"],
    lessUsefulTags: ["Urban enterprise sales", "Industrial procurement", "Investor positioning"],
    founderQuote: "Elena helped us realise adoption barriers were more behavioural than technical.",
    quoteContext:
      "This founder was working directly with farmers , Elena's field experience mapped exactly to the adoption problem.",
    expertise: ["Regenerative agriculture", "Rural adoption systems", "AgriTech scaling"],
    bestFor: ["puresoil"],
  },
];

const health: Mentor[] = [
  {
    id: "aisha-menon",
    name: "Dr. Aisha Menon",
    initials: "AM",
    role: "Healthcare systems & clinical operations advisor",
    years: 20,
    sector: "health",
    journey:
      "Aisha designed hospital workflow systems at Mayo Clinic and large healthcare networks , organisations with established budgets, IT infrastructure, and clinical governance. She understands deeply how healthcare institutions think and resist change. She has not built a startup from scratch.",
    addsValue: [
      "Navigating hospital workflow integration and clinical buy-in",
      "Understanding why institutions resist change , and how to work with it",
      "Designing products that survive contact with real clinical environments",
    ],
    mayStruggle: [
      "Pre-hospital traction teams still validating the clinical use case",
      "Founders who need help finding a buyer, not selling to one",
      "Building products before institutional credibility exists",
    ],
    honestCaveat:
      "Aisha's advice is grounded in how large healthcare institutions work , which is invaluable once a startup is selling to them. But her instincts are institutional, not entrepreneurial. A founder in early-stage discovery may need someone who has felt the uncertainty of not knowing if the product will find a market.",
    strongFitTags: ["Hospital workflow integration", "Clinical buy-in", "Institutional sales"],
    lessUsefulTags: ["Pre-traction discovery", "Clinical use-case validation", "Pre-institutional credibility"],
    founderQuote: "Aisha helped us understand why doctors resisted our product despite strong technology.",
    quoteContext:
      "This founder had a working product and was inside hospital pilots , exactly where Aisha's institutional lens compounds.",
    expertise: ["Clinical adoption", "Hospital workflows", "Healthcare systems integration"],
    bestFor: ["pulsetrack", "caresync", "medpredict"],
  },
  {
    id: "rohan-bedi",
    name: "Rohan Bedi",
    initials: "RB",
    role: "Partner at MedScale Ventures",
    years: 16,
    sector: "health",
    journey:
      "Rohan has been a healthcare investor and strategy consultant for 16 years. He has helped companies reposition for enterprise healthcare buyers and has a strong commercial lens. He has never personally run a HealthTech startup with his own capital and livelihood at stake.",
    addsValue: [
      "Sharpening commercial positioning for enterprise healthcare buyers",
      "Preparing healthcare startups for institutional fundraising",
      "Pattern-matching across many HealthTech trajectories",
    ],
    mayStruggle: [
      "Validating whether the clinical problem is even real",
      "Pre-revenue product discovery and use-case shaping",
      "Day-to-day execution and product calls under uncertainty",
    ],
    honestCaveat:
      "Rohan sees healthcare startups through the lens of what makes them fundable and commercially scalable. Founders in the earliest stage sometimes need someone who can help them validate whether the problem is real , not just whether the pitch is convincing.",
    strongFitTags: ["Commercial positioning", "Healthcare fundraising", "Enterprise repositioning"],
    lessUsefulTags: ["Clinical problem validation", "Pre-revenue discovery", "Product execution"],
    founderQuote: "Rohan helped us reposition our business for enterprise healthcare buyers.",
    quoteContext:
      "This founder had a working product seeking a clearer buyer , different from a team still validating the clinical use case.",
    expertise: ["Healthcare fundraising", "Growth strategy", "Market expansion"],
    bestFor: ["medilink", "nanocure", "pulsetrack"],
  },
  {
    id: "karan-kapoor",
    name: "Dr. Karan Kapoor",
    initials: "KK",
    role: "Biotech commercialisation & pharma partnerships advisor",
    years: 22,
    sector: "health",
    journey:
      "Karan led commercialisation inside Novartis , one of the world's largest pharmaceutical companies, with vast resources, regulatory teams, and established clinical networks. He understands the pharma partnership and drug commercialisation world better than almost anyone. He has operated exclusively inside large institutions.",
    addsValue: [
      "Structuring pharma partnerships and licensing deals",
      "Mapping regulatory pathways for drug and diagnostics commercialisation",
      "Designing long-horizon commercialisation strategies",
    ],
    mayStruggle: [
      "Bootstrapped or early-stage teams with 18-month runway",
      "Finding product-market fit before commercialisation planning",
      "Moving fast in environments without institutional support",
    ],
    honestCaveat:
      "Karan thinks in timelines that make sense inside a large pharma company , multi-year clinical programmes, institutional approvals, large partnership deals. An early-stage biotech startup with 18 months of runway is playing a fundamentally different game.",
    strongFitTags: ["Pharma partnerships", "Regulatory pathways", "Long-horizon commercialisation"],
    lessUsefulTags: ["Short-runway execution", "Pre-PMF discovery", "Fast iteration"],
    founderQuote: "Karan forced us to think about commercialisation years before launch.",
    quoteContext:
      "This founder had a validated biotech asset moving toward trials , Karan's institutional timelines matched the work.",
    expertise: ["Pharma partnerships", "Drug commercialization", "Regulatory approvals"],
    bestFor: ["biopulse", "geneticore", "nanocure"],
  },
  {
    id: "shreya-nair",
    name: "Shreya Nair",
    initials: "SN",
    role: "Consumer wellness product strategist",
    years: 12,
    sector: "health",
    journey:
      "Shreya has spent 12 years working inside consumer wellness startups focused on habit formation and subscription retention. She has worked on products where the unit economics depend on daily engagement. She has experienced early-stage product uncertainty and knows what it feels like to iterate quickly.",
    addsValue: [
      "Designing for habit formation and long-term consumer retention",
      "Iterating quickly on product under real user feedback",
      "Tuning subscription economics in consumer wellness",
    ],
    mayStruggle: [
      "Selling into hospitals, clinicians, or institutional buyers",
      "Operating inside regulated clinical environments",
      "Fundraising and GTM strategy outside consumer playbooks",
    ],
    honestCaveat:
      "Shreya's instincts are tuned for consumer products where retention is driven by habit and emotion. If a startup is selling to enterprises, clinicians, or institutional buyers, her frameworks around engagement and psychology may not translate directly.",
    strongFitTags: ["Consumer retention", "Habit-based engagement", "Subscription economics"],
    lessUsefulTags: ["Clinical/institutional sales", "Regulated environments", "Enterprise GTM"],
    founderQuote: "Shreya completely reframed how we thought about long-term engagement.",
    quoteContext:
      "This founder was running a consumer wellness app where retention was the whole business , Shreya's lens fit perfectly.",
    expertise: ["User engagement", "Habit formation", "Subscription retention"],
    bestFor: ["healmate", "vitasense"],
  },
  {
    id: "ethan-roy",
    name: "Dr. Ethan Roy",
    initials: "ER",
    role: "AI healthcare infrastructure advisor",
    years: 19,
    sector: "health",
    journey:
      "Ethan spent 19 years architecting AI and data infrastructure for large healthcare networks. He is exceptional at designing systems that work at scale inside complex, data-heavy environments. He has never personally built a healthcare startup or experienced the constraint of a small founding team.",
    addsValue: [
      "Architecting scalable healthcare data and AI infrastructure",
      "Designing for interoperability across complex clinical systems",
      "Future-proofing technical decisions in heavily regulated environments",
    ],
    mayStruggle: [
      "Pre-data-partnership startups still trying to access any hospital data",
      "Teams that need commercial and product help, not architecture",
      "Working with a 3-person team under short runway constraints",
    ],
    honestCaveat:
      "Ethan's mental model is built for environments with large data sets, established IT infrastructure, and long implementation timelines. A startup trying to get its first hospital to share any data at all is dealing with a very different problem.",
    strongFitTags: ["Healthcare data architecture", "Clinical AI infrastructure", "Interoperability"],
    lessUsefulTags: ["Pre-data-access teams", "Commercial/product guidance", "Short-runway execution"],
    founderQuote: "Ethan helped us redesign our entire healthcare data architecture.",
    quoteContext:
      "This founder had hospital data partnerships and was hitting infrastructure ceilings , exactly Ethan's domain.",
    expertise: ["AI diagnostics", "Healthcare infrastructure", "Clinical AI systems"],
    bestFor: ["nanocure", "pulsetrack", "medpredict"],
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
