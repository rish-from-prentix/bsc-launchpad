export type PhaseMeta = {
  index: number;
  title: string;
  summary: string;
  estimate: string;
};

export const AIC_PHASES: PhaseMeta[] = [
  {
    index: 1,
    title: "Thesis: The Basics",
    summary:
      "Choose a sector, study an example thesis deck, then upload your own Accelerator Investment Thesis.",
    estimate: "20–30 min",
  },
  {
    index: 2,
    title: "Startup Evaluation",
    summary:
      "Rate every shortlisted startup with the star system, compare finalists, and pick who advances into the cohort.",
    estimate: "25–35 min",
  },
  {
    index: 3,
    title: "Mentor Matching",
    summary:
      "Map the right mentor to each selected startup. A wrong pairing stalls momentum; the right one unlocks it.",
    estimate: "15–20 min",
  },
  {
    index: 4,
    title: "Operational Review",
    summary:
      "Run a root-cause investigation on a struggling cohort startup and recommend a path forward.",
    estimate: "20–25 min",
  },
  {
    index: 5,
    title: "Investment Memo",
    summary:
      "Deliver an independent investment assessment for the board's upcoming review discussion.",
    estimate: "25–30 min",
  },
];

export type InboxMessage = {
  id: string;
  phase: number;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  initials: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  accent: "indigo" | "teal" | "amber";
};

export const AIC_INBOX: InboxMessage[] = [
  {
    id: "p1-brief",
    phase: 1,
    senderName: "Animesh Sharma",
    senderEmail: "animesh@aic-isb.in",
    senderRole: "CEO, AIC × ISB",
    initials: "AS",
    subject: "Welcome to Your First Brief",
    preview:
      "Really glad to have you on board. As a first step, select one of three sectors and build your Accelerator Investment Thesis…",
    timestamp: "Today · 9:30 AM",
    accent: "indigo",
    body: `Hi {name},

Really glad to have you on board. You're joining at an exciting time, we're shaping the next AIC × ISB cohort, and I want fresh thinking involved from day one.

As a first step, select one of the three sectors in the workspace and build an Accelerator Investment Thesis around it.

Consider where you believe the most promising opportunities lie, what market trends or shifts are creating momentum today, and what qualities would make a startup stand out as a strong investment candidate.

There is no single right answer, we're interested in seeing your reasoning, judgment, and ability to identify compelling opportunities.

Best,
Animesh Sharma
CEO, AIC × ISB`,
  },
  {
    id: "p2-shortlist",
    phase: 2,
    senderName: "Animesh Sharma",
    senderEmail: "animesh@aic-isb.in",
    senderRole: "CEO, AIC × ISB",
    initials: "AS",
    subject: "Review Shortlisted Startups, ready when you are",
    preview:
      "The board reviewed your investment thesis. They agree with your direction. Take a moment, that matters…",
    timestamp: "Today · 11:04 AM",
    accent: "indigo",
    body: `Hi {name},

The board reviewed your investment thesis. They agree with your direction. Your recommendations are approved.

Take a moment, that matters.

WHAT HAPPENS NEXT

We're officially launching applications for the upcoming accelerator cohort. The screening team will run the first pass, then a shortlist lands on your desk.

YOUR ROLE

From the shortlist, identify the founders and businesses with the strongest potential. Not the flashiest decks. Not the buzziest sectors. The ones with real grit, a solvable problem, and a founder who'll still be standing when things get hard.

Let's find the next big ones.

Regards,
Animesh Sharma
CEO, AIC × ISB`,
  },
  {
    id: "p3-mentor",
    phase: 3,
    senderName: "Animesh Sharma",
    senderEmail: "animesh@aic-isb.in",
    senderRole: "Program Director, AIC × ISB",
    initials: "AS",
    subject: "Mentor Assignment for Accelerator Cohort",
    preview:
      "Completing the startup evaluation process is no small feat. But that was the warm-up, now we assign mentors…",
    timestamp: "Today · 2:15 PM",
    accent: "teal",
    body: `Hi {name},

First, well done. Completing the startup evaluation process is no small feat, and the quality of thinking you brought to it didn't go unnoticed.

But here's the truth: that was the warm-up.

The startups you selected are now entering the accelerator phase. Founders are no longer pitching; they're building, pivoting, and hitting walls. Your job now is to make sure they don't hit those walls alone.

YOUR NEXT MISSION: MENTOR ASSIGNMENT

You'll be assigning mentors to each of your selected startups. A wrong mentor-founder match can stall a startup's momentum for months. A right one can be the difference between a pivot that works and one that doesn't.

Looking forward to seeing what you put together.

Best,
Animesh Sharma`,
  },
  {
    id: "p4-rca",
    phase: 4,
    senderName: "Animesh Sharma",
    senderEmail: "animesh@aic-isb.in",
    senderRole: "CEO, AIC × ISB",
    initials: "AS",
    subject: "Urgent, one of our cohort startups is in trouble",
    preview:
      "Numbers are slipping. We need a clear-headed investigation into what is actually going wrong before we intervene…",
    timestamp: "Yesterday · 6:48 PM",
    accent: "amber",
    body: `Hi {name},

One of the startups in our current cohort is in trouble. The numbers are slipping and the founder is asking for help, but the surface story doesn't match the data.

Before we intervene, I need a clear-headed root-cause investigation. Look past the symptoms. Identify the actual failure point. Then recommend a path forward we can take to the next operating review.

You'll have the data room and founder transcripts in the workspace.

Animesh Sharma
CEO, AIC × ISB`,
  },
  {
    id: "p5-memo",
    phase: 5,
    senderName: "Vikram Sethi",
    senderEmail: "vikram@aicventures.in",
    senderRole: "Board Member, AIC Ventures",
    initials: "VS",
    subject: "Your Investment Take",
    preview:
      "We're reviewing a potential investment opportunity and need an independent assessment before the board discussion…",
    timestamp: "Today · 4:42 PM",
    accent: "indigo",
    body: `Hi {name},

We're currently reviewing a potential investment opportunity that has generated significant internal discussion among the board.

Before moving forward, I'd like an independent assessment of the company's business fundamentals, operational strength, and long-term scalability.

Your evaluation will be included in our upcoming investment review discussion, so I'd encourage you to approach this with both strategic and analytical rigor.

Please review the startup and share your recommendation.

Vikram Sethi
Board Member, AIC Ventures`,
  },
];
