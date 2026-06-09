import type { ThemeId } from "./startups-data";

export type Outcome = "correct" | "wrong" | "partial";

export type InvestigationOption = {
  id: "A" | "B" | "C" | "D";
  title: string;
  description: string;
  outcome: Outcome;
  feedback: string;
  hint?: string;
};

export type InvestigationStep = {
  title: string;
  context: string;
  tip: string;
  options: InvestigationOption[];
};

export type InvestigationCase = {
  ceo: {
    name: string;
    role: string;
    initials: string;
    company: string;
    email: string;
  };
  email: { subject: string; body: string; timestamp: string };
  steps: InvestigationStep[]; // 5
  narrative: string;
  takeaway: string;
};

export const SCORE_BY_OUTCOME: Record<Outcome, number> = {
  correct: 1,
  partial: 0.5,
  wrong: 0,
};

export const INVESTIGATIONS: Record<ThemeId, InvestigationCase> = {
  ai: {
    ceo: {
      name: "Aarav Mehta",
      role: "Founder & CEO, NeuroPilot AI",
      initials: "AM",
      company: "NeuroPilot AI",
      email: "aarav@neuropilot.ai",
    },
    email: {
      subject: "I need fresh eyes on this",
      timestamp: "Today · 09:42 AM",
      body: `Hi,

I've been staring at our numbers for two months and I still don't have a clear answer. On paper, things look fine. Our marketing is generating leads. Demos are happening. New signups keep coming in.

But here's what's keeping me up at night: our paying customers are leaving. Month after month, renewal rates are dropping , and churn is climbing even among teams that were genuinely excited when they signed up.

We've argued internally about whether this is a sales problem, a product problem, or just the market getting more competitive. Nobody agrees. I need someone to look at this fresh and tell me: what is actually going wrong, and what do we fix first?

, Aarav`,
    },
    steps: [
      {
        title: "Where in the business is the problem?",
        context:
          "Aarav says signups are healthy but customers are leaving. Before diving into data, you need to figure out which part of the business to look at first.",
        tip: "Acquisition looks healthy. Where does the journey break down for customers who actually paid?",
        options: [
          {
            id: "A",
            title: "Marketing & Acquisition",
            description: "Ad spend, lead quality, CAC, demo pipeline",
            outcome: "wrong",
            feedback:
              "Marketing appears healthy , CAC is stable and leads are growing. The problem begins after customers enter the product.",
            hint: "Focus on what happens after someone signs up.",
          },
          {
            id: "B",
            title: "Product Usage & Retention",
            description: "Feature adoption, onboarding, activation, churn signals",
            outcome: "correct",
            feedback:
              "Smart call. Churn rising while acquisition stays healthy is a classic retention signal.",
          },
          {
            id: "C",
            title: "Sales Team Performance",
            description: "Demo quality, closing scripts, CRM pipeline",
            outcome: "wrong",
            feedback:
              "Sales is only slightly underperforming and can't explain rising churn post-purchase. You're looking at the wrong stage.",
            hint: "The problem persists after the sale is closed.",
          },
          {
            id: "D",
            title: "Competitive Landscape",
            description: "Competitor launches, pricing, win/loss analysis",
            outcome: "partial",
            feedback:
              "Competitors did launch better templates recently , but churn started rising before those launches. Competition is a factor, not the root.",
            hint: "Timeline analysis suggests something internal came first.",
          },
        ],
      },
      {
        title: "What data do you pull first?",
        context:
          "You're looking at product usage. Which metric tells you the most about why customers might be leaving?",
        tip: "Behavior data leads. Complaint data lags. Pick the earliest signal you can.",
        options: [
          {
            id: "A",
            title: "Feature Adoption Rate",
            description: "Which core features are users actually turning on?",
            outcome: "correct",
            feedback:
              "Right move. Most users stop engaging after Day 3 and advanced features are barely touched.",
          },
          {
            id: "B",
            title: "Support Ticket Volume",
            description: "Volume and category of customer complaints",
            outcome: "wrong",
            feedback:
              "Tickets lag behind behavior. You need earlier signal.",
            hint: "Look at what users do , not just when they complain.",
          },
          {
            id: "C",
            title: "Social Media Sentiment",
            description: "Brand mentions, review scores, LinkedIn engagement",
            outcome: "wrong",
            feedback:
              "Vanity metrics don't explain retention problems.",
            hint: "Focus on in-product behavior.",
          },
          {
            id: "D",
            title: "Revenue Per Account",
            description: "ACV trends, expansion revenue, upsell rates",
            outcome: "wrong",
            feedback:
              "Revenue confirms there's a problem but doesn't explain why.",
            hint: "Diagnose behavior first, then link to revenue.",
          },
        ],
      },
      {
        title: "Feature adoption is low. What next?",
        context:
          "Most users disengage after Day 3. Advanced automation features are barely used. Now you need to find the specific bottleneck.",
        tip: "Where in the first-week journey are users actually dropping off?",
        options: [
          {
            id: "A",
            title: "Onboarding Completion Rate",
            description: "How many users finish setup and integrate their workflows?",
            outcome: "correct",
            feedback:
              "Found it. Only 28% of customers complete onboarding. Most abandon before integrating any workflows.",
          },
          {
            id: "B",
            title: "Pricing Sensitivity",
            description: "Are customers leaving because of cost?",
            outcome: "wrong",
            feedback:
              "Cost isn't the issue , they're leaving before they've fully used the product.",
            hint: "Look at the first week, not renewal time.",
          },
          {
            id: "C",
            title: "API Integration Quality",
            description: "Are technical docs reliable and clear?",
            outcome: "wrong",
            feedback:
              "Most users are abandoning before they even reach integration.",
            hint: "The bottleneck is earlier in the journey.",
          },
          {
            id: "D",
            title: "Customer Success Coverage",
            description: "Are enough CSMs assigned per account?",
            outcome: "wrong",
            feedback:
              "CS resourcing is downstream. The product itself isn't guiding users to value fast enough.",
            hint: "Fix the product before scaling human support.",
          },
        ],
      },
      {
        title: "What's actually causing this?",
        context:
          "28% onboarding completion. Users abandon before activating workflows. What's the most accurate explanation?",
        tip: "What single explanation accounts for the timing, the scale, and the behavior?",
        options: [
          {
            id: "A",
            title: "Product is too complex at first use",
            description: "Setup friction stops users before they see real value",
            outcome: "correct",
            feedback:
              "Confirmed. Customers fail to reach the 'aha moment' because initial setup is too hard. This explains everything: churn timing, low adoption, early drop-off.",
          },
          {
            id: "B",
            title: "Wrong customer segment",
            description: "Leads are unqualified for the product",
            outcome: "wrong",
            feedback:
              "Demos go well and signups are strong , these are qualified customers who just can't activate.",
            hint: "The problem is activation, not qualification.",
          },
          {
            id: "C",
            title: "Market is too competitive",
            description: "Customers have better alternatives",
            outcome: "wrong",
            feedback:
              "Customers are churning before fully using the product , they're not leaving for competitors, they're leaving before giving it a real chance.",
            hint: "Churn is happening too early to be competitive switching.",
          },
          {
            id: "D",
            title: "Not enough post-sale support",
            description: "CS team is too small for the customer base",
            outcome: "partial",
            feedback:
              "CS gaps contribute, but 72% abandonment is a structural product problem , not a staffing one.",
            hint: "Scale of the problem points to the product, not the team.",
          },
        ],
      },
      {
        title: "What do you fix first?",
        context:
          "You've found the problem. Now make your recommendation. What's the highest-leverage thing NeuroPilot should do?",
        tip: "Fix the leak before filling the bucket. Where does one move move the most metrics?",
        options: [
          {
            id: "A",
            title: "Increase ad spend",
            description: "Acquire more customers to offset churn",
            outcome: "wrong",
            feedback:
              "Pouring more customers into a broken funnel burns cash and worsens LTV. Fix the leak before filling the bucket.",
            hint: "Solve retention before scaling acquisition.",
          },
          {
            id: "B",
            title: "Redesign onboarding with guided setup and templates",
            description: "Simplify first-run experience, reduce time-to-value",
            outcome: "correct",
            feedback:
              "This directly addresses the 72% abandonment. AI-guided setup, prebuilt workflow templates, and faster activation are the right moves.",
          },
          {
            id: "C",
            title: "Hire more salespeople",
            description: "Increase demo volume and pipeline",
            outcome: "wrong",
            feedback:
              "More sales won't fix post-sale churn.",
            hint: "Retention happens in the product, not the pitch.",
          },
          {
            id: "D",
            title: "Raise prices to filter serious buyers",
            description: "Higher pricing to reduce low-intent signups",
            outcome: "wrong",
            feedback:
              "Price won't fix a setup experience that's too complex for even motivated customers.",
            hint: "The issue is experience, not buyer intent.",
          },
        ],
      },
    ],
    narrative:
      "NeuroPilot wasn't losing customers because of marketing, sales, or competition , it was losing them inside the product. Acquisition was healthy, but only 28% of new customers ever completed onboarding. Most never reached the 'aha moment,' so churn climbed exactly as activation collapsed. The fix isn't more leads or more salespeople; it's a redesigned first-run experience that gets customers to value fast.",
    takeaway:
      "When acquisition is strong and retention is weak, the answer is almost never 'more customers.' It's faster time-to-value.",
  },

  climate: {
    ceo: {
      name: "Rhea Kapoor",
      role: "Founder & CEO, GreenLoop Energy",
      initials: "RK",
      company: "GreenLoop Energy",
      email: "rhea@greenloop.energy",
    },
    email: {
      subject: "Something isn't adding up",
      timestamp: "Today · 09:42 AM",
      body: `Hi,

Six months ago we made a big bet. We expanded our EV charging network across several new cities , ahead of schedule, under budget, and with solid press coverage. By every operational measure, the rollout worked.

But the numbers we actually care about , how often people are charging at our stations , keep falling. Some of our newest locations are almost completely empty during the week.

I keep asking the team why, and I keep getting different answers. Marketing says it's awareness. Ops says it's location. Finance says we expanded too fast. I need you to cut through the noise and tell me: why aren't people using our stations, and what do we do about it?

, Rhea`,
    },
    steps: [
      {
        title: "Where does the problem start?",
        context:
          "Rhea says stations are built and operational, but utilization keeps falling. Where do you look first?",
        tip: "Execution went well. The question is whether the strategy behind the execution was right.",
        options: [
          {
            id: "A",
            title: "Expansion Strategy & Site Selection",
            description: "Where were stations placed, and based on what?",
            outcome: "correct",
            feedback:
              "Good starting point. The operational rollout went well , the real question is whether stations were placed where demand actually exists.",
          },
          {
            id: "B",
            title: "Brand Awareness & Marketing",
            description: "Do EV drivers know about GreenLoop?",
            outcome: "wrong",
            feedback:
              "Brand awareness has actually improved. Drivers know about GreenLoop , they're just not using the new stations.",
            hint: "The problem is real-world usage, not visibility.",
          },
          {
            id: "C",
            title: "Operations & Maintenance",
            description: "Are stations functioning reliably?",
            outcome: "wrong",
            feedback:
              "Uptime is high and ops is running smoothly. The stations work fine , they're just sitting empty.",
            hint: "The stations are working. Drivers just aren't going to them.",
          },
          {
            id: "D",
            title: "Investor & Financial Pressure",
            description: "Is pressure from investors forcing rushed decisions?",
            outcome: "wrong",
            feedback:
              "Investor concern reflects the problem , it doesn't cause it.",
            hint: "Look for the strategic decision that created the utilization gap.",
          },
        ],
      },
      {
        title: "What data do you pull first?",
        context:
          "You're examining expansion strategy. Which data tells you the most about why new stations are underperforming?",
        tip: "Compare what's working to what's not. Cohorts often reveal the strategic mistake.",
        options: [
          {
            id: "A",
            title: "Utilization by Station Cohort",
            description: "Compare old vs new station performance over time",
            outcome: "correct",
            feedback:
              "Key finding: older stations perform well. Newly launched stations have extremely low utilization. This cohort split is the critical clue.",
          },
          {
            id: "B",
            title: "Customer Satisfaction Scores",
            description: "Survey EV drivers on app experience and charging speed",
            outcome: "wrong",
            feedback:
              "Drivers aren't coming to these stations at all , satisfaction data would be nearly empty.",
            hint: "You need demand data, not experience data.",
          },
          {
            id: "C",
            title: "PR & Media Coverage",
            description: "Sentiment and volume of press mentions",
            outcome: "wrong",
            feedback:
              "Media coverage is positive. Strong awareness can't compensate for weak location demand.",
            hint: "The problem isn't perception , it's location.",
          },
          {
            id: "D",
            title: "Charging Speed Benchmarks",
            description: "How does GreenLoop compare to competitors on speed?",
            outcome: "wrong",
            feedback:
              "Speed would matter in high-density areas. In low-demand zones, drivers aren't present at all.",
            hint: "Product quality can't overcome a demand problem.",
          },
        ],
      },
      {
        title: "Old stations work, new ones don't. Why?",
        context:
          "The cohort split points to a site selection problem. What specific variable explains why new locations underperform?",
        tip: "Charging only happens where EVs already are. What fundamental demand signal might have been ignored?",
        options: [
          {
            id: "A",
            title: "EV Ownership Density Near Each Station",
            description: "How many EVs are registered in the catchment area?",
            outcome: "correct",
            feedback:
              "Found it. Most low-performing stations are in areas with very low EV ownership. No marketing can create charging demand where EVs don't exist.",
          },
          {
            id: "B",
            title: "Proximity to Competitor Stations",
            description: "Are rival chargers nearby stealing traffic?",
            outcome: "wrong",
            feedback:
              "In the underperforming zones, there are very few EVs , competition is irrelevant when demand doesn't exist.",
            hint: "Think about the fundamental demand driver.",
          },
          {
            id: "C",
            title: "Visual Branding & Station Design",
            description: "Are stations visible and attractively designed?",
            outcome: "wrong",
            feedback:
              "Design doesn't matter when EV drivers simply don't live or work nearby.",
            hint: "Think about why drivers would be in the area at all.",
          },
          {
            id: "D",
            title: "Proximity to Corporate Offices",
            description: "Are stations near offices for workplace charging?",
            outcome: "partial",
            feedback:
              "Workplace proximity is a useful factor , but it's one variable within a broader demand picture. The core failure was not modelling overall EV density.",
            hint: "Think more broadly about what drives charging demand in an area.",
          },
        ],
      },
      {
        title: "What's the core strategic failure?",
        context:
          "Stations are in low-EV-density areas. Older stations (placed in proven zones) perform well. What went wrong?",
        tip: "Separate strategy failures from execution failures. Where exactly did the wrong call get made?",
        options: [
          {
            id: "A",
            title: "Poor demand forecasting at site selection",
            description: "Expansion wasn't driven by EV ownership data",
            outcome: "correct",
            feedback:
              "Confirmed. GreenLoop expanded at speed without validating sufficient EV density in target areas. Execution was excellent , strategy was not.",
          },
          {
            id: "B",
            title: "Weak brand in new markets",
            description: "Drivers in new cities don't know about GreenLoop",
            outcome: "wrong",
            feedback:
              "Awareness is actually growing. Drivers know the brand , they just don't own EVs, or their routes take them elsewhere.",
            hint: "The issue is demand, not awareness.",
          },
          {
            id: "C",
            title: "Slow maintenance in new locations",
            description: "Stations are offline too often",
            outcome: "wrong",
            feedback:
              "Station uptime is high. The stations work , they're just in the wrong places.",
            hint: "The problem is strategic, not operational.",
          },
          {
            id: "D",
            title: "Insufficient capital for expansion",
            description: "Fundraising constraints are limiting rollout quality",
            outcome: "wrong",
            feedback:
              "GreenLoop expanded ahead of schedule. Capital isn't the constraint , how it was deployed is.",
            hint: "They have the resources. The question is how they used them.",
          },
        ],
      },
      {
        title: "What do you recommend?",
        context:
          "The problem is clear: stations were placed in low-demand zones without validating EV density. What's the right move now?",
        tip: "Don't just stop the bleeding , build the capability that prevents the next bad bet.",
        options: [
          {
            id: "A",
            title: "Pause all expansion",
            description: "Stop new installs until the model is fixed",
            outcome: "partial",
            feedback:
              "A pause might be part of the answer, but it's not enough. You need to build the capability that tells you where to go next.",
            hint: "Don't just stop , build the forecasting process.",
          },
          {
            id: "B",
            title: "Build an EV density scoring model and prioritize high-demand zones",
            description: "Data-gate future expansion; double down on proven corridors",
            outcome: "correct",
            feedback:
              "Correct. Prioritize utilization in high-performing zones, pilot new sites with EV density scoring before committing, and partner with malls, offices, and highways in proven demand corridors.",
          },
          {
            id: "C",
            title: "Relocate underperforming stations",
            description: "Cut losses and move hardware to better locations",
            outcome: "partial",
            feedback:
              "Relocation is costly and avoids the structural fix: building a demand-validation process so future sites are chosen correctly.",
            hint: "Fix the process, not just the assets.",
          },
          {
            id: "D",
            title: "Increase advertising in new markets",
            description: "Drive app downloads and brand awareness among local EV drivers",
            outcome: "wrong",
            feedback:
              "Marketing can't create EV ownership where it doesn't exist. That adoption curve is years long.",
            hint: "You can't market your way out of a demand problem.",
          },
        ],
      },
    ],
    narrative:
      "GreenLoop's expansion looked flawless on the surface , on schedule, on budget, well-covered. But the team had optimized execution while skipping the most important strategic question: is there demand here? Cohort data showed older stations in proven EV corridors performed well, while new stations sat empty in low-EV-density zones. The fix is a real demand-forecasting capability, not more marketing or another rollout sprint.",
    takeaway:
      "Operational excellence doesn't fix a strategic miss. Validate demand before you scale the build.",
  },

  health: {
    ceo: {
      name: "Dr. Kavya Sharma",
      role: "Founder & CEO, MediSync Health",
      initials: "KS",
      company: "MediSync Health",
      email: "kavya@medisync.health",
    },
    email: {
      subject: "We're losing hospitals and I don't know why",
      timestamp: "Today · 09:42 AM",
      body: `Hi,

A year ago, hospitals were adopting our monitoring platform faster than we expected. The onboarding feedback was excellent. Doctors told us they loved seeing their patients in real time.

But over the last few months, something changed. Renewal rates have dropped sharply. What's strange is that hospitals aren't pushing back on price , they're just quietly disengaging. The platform works. The data is accurate. But doctors seem to be drifting away from it, and I don't fully understand why.

I need clarity before our renewal season starts. What went wrong, and what do we prioritize fixing?

, Dr. Sharma`,
    },
    steps: [
      {
        title: "Where does the disengagement start?",
        context:
          "Hospitals adopted enthusiastically. Now they're quietly drifting away , not over price. Where do you investigate first?",
        tip: "When existing customers go quiet, the answer is usually in their daily experience , not in sales or marketing.",
        options: [
          {
            id: "A",
            title: "Clinical Workflow Integration",
            description: "How does the platform fit into doctors' daily routine?",
            outcome: "correct",
            feedback:
              "Right framing. When existing users disengage (not new customers), the most likely cause is friction in their day-to-day experience.",
          },
          {
            id: "B",
            title: "Pricing & Contract Terms",
            description: "Are hospitals resisting cost at renewal?",
            outcome: "wrong",
            feedback:
              "The CEO explicitly said pricing isn't the issue. Hospitals are disengaging, not negotiating harder.",
            hint: "Rule out what you already know.",
          },
          {
            id: "C",
            title: "Brand & Marketing Campaigns",
            description: "Do hospital decision-makers know about the platform?",
            outcome: "wrong",
            feedback:
              "These hospitals already adopted the platform. Brand awareness is irrelevant when existing customers disengage.",
            hint: "These are current customers , the issue is retention, not awareness.",
          },
          {
            id: "D",
            title: "Hiring & Team Capacity",
            description: "Is MediSync understaffed to support customers?",
            outcome: "wrong",
            feedback:
              "CS headcount is slightly low but not a full explanation. The issue appears structural.",
            hint: "Think about what doctors experience every day in the product.",
          },
        ],
      },
      {
        title: "What metric do you look at?",
        context:
          "You're focused on clinical workflow. What's the most diagnostic behavioral data to pull?",
        tip: "Behavior comes before survey results. What doctors do is more honest than what they say.",
        options: [
          {
            id: "A",
            title: "Daily Active Doctor Login Rate",
            description: "Are doctors opening the platform regularly?",
            outcome: "correct",
            feedback:
              "Confirmed: doctors are logging in less frequently every month. This is the behavioral signature of disengagement , and it's getting worse.",
          },
          {
            id: "B",
            title: "Patient Outcome Data",
            description: "Are clinical outcomes improving with the platform?",
            outcome: "partial",
            feedback:
              "Outcomes matter long-term, but they lag behavior. You need to know if doctors are using it at all before measuring impact.",
            hint: "Measure engagement before measuring outcomes.",
          },
          {
            id: "C",
            title: "Net Promoter Score",
            description: "Would doctors recommend the platform?",
            outcome: "wrong",
            feedback:
              "NPS is a survey that lags behavior. By the time it drops, doctors have already stopped using the product.",
            hint: "Look at what doctors actually do, not what they say.",
          },
          {
            id: "D",
            title: "Press & Analyst Coverage",
            description: "How is MediSync perceived in healthtech media?",
            outcome: "wrong",
            feedback:
              "Media perception is positive. This is an internal product experience problem.",
            hint: "Renewal decisions are driven by daily workflow friction, not press coverage.",
          },
        ],
      },
      {
        title: "Doctors are logging in less. Why?",
        context:
          "Daily login rates are declining month-over-month. What specific in-product experience is driving the drop?",
        tip: "Think about cognitive load on a busy hospital shift. What part of the experience could quietly become unbearable?",
        options: [
          {
            id: "A",
            title: "Alert Volume & Quality",
            description: "Are doctors being overwhelmed by notifications?",
            outcome: "correct",
            feedback:
              "Found it. Doctors receive hundreds of low-priority, repetitive alerts daily. They're tuning the platform out entirely to escape the noise.",
          },
          {
            id: "B",
            title: "Patient Data Accuracy",
            description: "Are monitoring readings unreliable?",
            outcome: "wrong",
            feedback:
              "Data quality issues would cause immediate complaints. This is a gradual disengagement pattern, not a malfunction.",
            hint: "The pattern suggests friction, not errors.",
          },
          {
            id: "C",
            title: "EHR System Integration",
            description: "Is the platform hard to connect with hospital systems?",
            outcome: "partial",
            feedback:
              "Integration friction could contribute , but doctors are already onboarded. The declining engagement is happening within existing use.",
            hint: "The friction is in daily use, not initial setup.",
          },
          {
            id: "D",
            title: "Dashboard Design",
            description: "Is the monitoring interface confusing or poorly laid out?",
            outcome: "wrong",
            feedback:
              "Doctors report frustration with workflow overload, not visual confusion. The issue is what the platform asks them to do , not how it looks.",
            hint: "Think about cognitive load during a busy shift.",
          },
        ],
      },
      {
        title: "What's the core problem?",
        context:
          "Hundreds of low-priority alerts daily. Repetitive, clinically unimportant noise. What's the precise diagnosis?",
        tip: "Name the phenomenon. The right name unlocks the right fix.",
        options: [
          {
            id: "A",
            title: "Alert fatigue from unfiltered notifications",
            description: "Doctors are overwhelmed and tuning the platform out",
            outcome: "correct",
            feedback:
              "Confirmed. Alert fatigue is a well-documented clinical phenomenon. MediSync is training doctors to ignore it , including the alerts that matter.",
          },
          {
            id: "B",
            title: "Poor clinical training during onboarding",
            description: "Doctors were never properly taught to use it",
            outcome: "wrong",
            feedback:
              "Initial onboarding feedback was excellent. This is a problem that developed gradually after good adoption.",
            hint: "Something builds up over time , what is it?",
          },
          {
            id: "C",
            title: "Competitive products are catching up",
            description: "Rival platforms have better features now",
            outcome: "wrong",
            feedback:
              "Hospitals aren't citing competitive reasons , they're quietly stopping use. A competitive threat shows up in renewal negotiations.",
            hint: "Look at the pattern: gradual disengagement, not active switching.",
          },
          {
            id: "D",
            title: "Regulatory and compliance burden",
            description: "Documentation requirements are too time-consuming",
            outcome: "wrong",
            feedback:
              "Compliance burden would have surfaced at procurement. This is a usage problem that developed after enthusiastic adoption.",
            hint: "What worsens the more you use a notification-heavy system?",
          },
        ],
      },
      {
        title: "What do you build first?",
        context:
          "Doctors are overwhelmed by low-value alerts and tuning the platform out. What's the most effective fix?",
        tip: "Reduce cognitive load at the root. A blunt filter is better than nothing , but is it enough?",
        options: [
          {
            id: "A",
            title: "Simple severity threshold filter",
            description: "Set a minimum score before alerts fire",
            outcome: "partial",
            feedback:
              "Better than the status quo, but too blunt. Doctors have different patient populations , a one-size filter will silence important alerts for some while still overwhelming others.",
            hint: "Think about personalization and clinical context.",
          },
          {
            id: "B",
            title: "AI-based alert prioritization with custom preferences",
            description: "Smart severity scoring + doctor-configurable settings",
            outcome: "correct",
            feedback:
              "Correct. AI prioritization reduces noise dynamically, and custom preferences let doctors tune alerts for their specific patient population. This eliminates fatigue at the root.",
          },
          {
            id: "C",
            title: "More monitoring dashboards and data views",
            description: "Give doctors richer data access",
            outcome: "wrong",
            feedback:
              "More data adds cognitive load , the opposite of what doctors need. The problem is information overload, not scarcity.",
            hint: "Reduce burden, don't add more.",
          },
          {
            id: "D",
            title: "Raise prices and expand the CS team",
            description: "Premium tier to fund white-glove support",
            outcome: "wrong",
            feedback:
              "Raising prices while the core product overwhelms its users would accelerate churn.",
            hint: "Fix the product first.",
          },
        ],
      },
    ],
    narrative:
      "MediSync's platform worked , too well, in the wrong direction. Doctors were being buried under hundreds of low-priority alerts each shift, and they coped by tuning the entire system out. That's the textbook pattern of alert fatigue: gradual disengagement without complaints, especially when price isn't the issue. The right fix isn't more support or a premium tier , it's intelligent, doctor-configurable alert prioritization.",
    takeaway:
      "In clinical software, signal matters more than volume. Reducing noise is a feature.",
  },
};
