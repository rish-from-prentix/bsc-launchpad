import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SplashScreen } from "@/components/screens/splash-screen";
import { PrimersOverview } from "@/components/screens/primers-overview";
import { PrimerMarketing } from "@/components/screens/primer-marketing";
import { PrimerNewsvendor } from "@/components/screens/primer-newsvendor";
import { PrimerChannel } from "@/components/screens/primer-channel";
import { Quiz, type QuizQuestion } from "@/components/screens/quiz";
import { ResultsScreen } from "@/components/screens/results-screen";
import { ZTableFloating } from "@/components/z-table";
import { TaskIntro } from "@/components/screens/task-intro";
import { SimulationMonth } from "@/components/screens/simulation-month";
import { MonthFeedback } from "@/components/screens/month-feedback";
import { FinalResults } from "@/components/screens/final-results";
import { MONTH_0, type MonthData } from "@/lib/simulation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BSC Virtual Internship — Powered by Prentix" },
      {
        name: "description",
        content:
          "Step into the role of a Growth & Business Operations Intern at Bombay Shaving Company. A virtual internship experience powered by Prentix.",
      },
    ],
  }),
  component: Index,
});

type Screen =
  | "splash"
  | "overview"
  | "primer-1"
  | "quiz-1"
  | "primer-2"
  | "quiz-2"
  | "primer-3"
  | "quiz-3"
  | "results"
  | "task-intro"
  | "sim-1"
  | "feedback-1"
  | "sim-2"
  | "feedback-2"
  | "sim-3"
  | "feedback-3"
  | "sim-4"
  | "feedback-4"
  | "sim-5"
  | "feedback-5"
  | "final";

const PRIMER_META = [
  {
    id: 1,
    title: "Marketing Elasticity",
    desc: "How marketing spend drives — or doesn't drive — sales.",
  },
  {
    id: 2,
    title: "Newsvendor Analysis",
    desc: "How to stock the right amount. Not too much. Not too little.",
  },
  {
    id: 3,
    title: "Channel Strategy",
    desc: "D2C vs Quick Commerce. The eternal trade-off.",
  },
];

const QUIZ_1: QuizQuestion[] = [
  {
    prompt:
      "On a monthly marketing spend of ₹33,000, our Bangalore office is selling products worth ₹3,20,000. Marketing elasticity is estimated at 1.8–1.9. If we increase the budget to ₹34,000, what will the next month's sales be?",
    options: ["₹3,14,432", "₹3,23,653", "₹3,37,952", "₹3,68,614"],
    correctIndex: 2,
    explanation: (
      <>
        <div>Spend increase = (34,000 − 33,000) / 33,000 = +3.03%</div>
        <div>Elasticity (midpoint of 1.8–1.9) = 1.85</div>
        <div>Sales increase = 3.03% × 1.85 = 5.61%</div>
        <div className="text-primary">
          New sales = ₹3,20,000 × 1.0561 = ₹3,37,952 ✓
        </div>
      </>
    ),
  },
  {
    prompt:
      "If the budget drops to ₹32,000 instead, what will sales be?",
    options: ["₹2.92L", "₹3.02L", "₹3.20L", "₹2.32L"],
    correctIndex: 1,
    explanation: (
      <>
        <div>Spend change = (32,000 − 33,000) / 33,000 = −3.03%</div>
        <div>Elasticity (midpoint) = 1.85</div>
        <div>Sales change = −3.03% × 1.85 = −5.61%</div>
        <div className="text-primary">
          New sales = ₹3,20,000 × 0.9439 ≈ ₹3.02L ✓
        </div>
      </>
    ),
  },
];

const QUIZ_2: QuizQuestion[] = [
  {
    prompt:
      "BSC is planning inventory for Beard Oil in Hyderabad. Expected demand: 320 units (std dev = 80). Selling price: ₹599. Production cost: ₹210. Holding cost: ₹25/unsold unit. How many units should they stock?",
    note: "The holding cost of ₹25 is the only cost of unsold inventory. Do not add it to the production cost.",
    options: ["132", "320", "390", "450"],
    correctIndex: 3,
    explanation: (
      <>
        <div>CU = ₹599 − ₹210 = ₹389</div>
        <div>CO = ₹25</div>
        <div>Critical Ratio = 389 / 414 = 0.94</div>
        <div>Z-score ≈ 1.65</div>
        <div className="text-primary">
          Optimal Stock = 320 + (1.65 × 80) = 452 ≈ 450 ✓
        </div>
      </>
    ),
  },
];

const QUIZ_3: QuizQuestion[] = [
  {
    prompt:
      "BSC is deciding how to allocate additional inventory across D2C and Quick Commerce. Which approach best maximizes overall profitability?",
    options: [
      "Allocate more to D2C — higher margins.",
      "Allocate more to QC — higher volume.",
      "Allocate based on which channel delivers more total profit per unit of effort.",
      "Split equally to balance risk.",
    ],
    correctIndex: 2,
    explanation: (
      <div className="font-sans">
        Don't chase margin or volume in isolation. A channel with great margins
        but no sales, or massive volume but razor-thin margins, both leave
        money on the table. The question is always: where does one extra unit
        earn the most profit after all costs?
      </div>
    ),
  },
];

function Index() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [name, setName] = useState("");
  const [completed, setCompleted] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);
  const [scores, setScores] = useState<[number, number, number]>([0, 0, 0]);
  // months[0] = MONTH_0; months[1..5] populated as user submits
  const [months, setMonths] = useState<MonthData[]>(() => [MONTH_0]);
  const [reviewing, setReviewing] = useState<number | null>(null);

  const totalScore = scores[0] + scores[1] + scores[2];

  function startBeging(n: string) {
    setName(n);
    setScreen("overview");
  }

  function startPrimer(idx: number) {
    if (idx === 0) setScreen("primer-1");
    if (idx === 1) setScreen("primer-2");
    if (idx === 2) setScreen("primer-3");
  }

  function completeQuiz(idx: 0 | 1 | 2, correct: number) {
    const c = [...completed] as [boolean, boolean, boolean];
    c[idx] = true;
    setCompleted(c);
    const s = [...scores] as [number, number, number];
    s[idx] = correct;
    setScores(s);

    if (idx === 0) setScreen("primer-2");
    else if (idx === 1) setScreen("primer-3");
    else setScreen("results");
  }

  function redoAll() {
    setCompleted([false, false, false]);
    setScores([0, 0, 0]);
    setScreen("primer-1");
  }

  function submitMonth(n: number, data: MonthData) {
    setMonths((m) => {
      const next = [...m];
      next[n] = data;
      return next;
    });
    setScreen(`feedback-${n}` as Screen);
  }

  function nextAfterFeedback(n: number) {
    if (n >= 5) setScreen("final");
    else setScreen(`sim-${n + 1}` as Screen);
  }

  const cumulativeEbitda = months
    .filter((m) => m && m.month >= 1)
    .reduce((s, m) => s + (m.totalProfit ?? 0), 0);

  if (screen === "splash") {
    return <SplashScreen onBegin={startBeging} />;
  }

  const ctx = (() => {
    switch (screen) {
      case "overview":
        return "Onboarding Overview";
      case "primer-1":
        return "Primer 1 of 3 · Marketing Elasticity";
      case "quiz-1":
        return "Quiz 1 of 3 · Marketing Elasticity";
      case "primer-2":
        return "Primer 2 of 3 · Newsvendor Analysis";
      case "quiz-2":
        return "Quiz 2 of 3 · Newsvendor Analysis";
      case "primer-3":
        return "Primer 3 of 3 · Channel Strategy";
      case "quiz-3":
        return "Quiz 3 of 3 · Channel Strategy";
      case "results":
        return "Results";
      case "task-intro":
        return "Day One · Briefing";
      case "sim-1":
      case "sim-2":
      case "sim-3":
      case "sim-4":
      case "sim-5":
        return `Internship · Month ${screen.slice(-1)} of 5`;
      case "feedback-1":
      case "feedback-2":
      case "feedback-3":
      case "feedback-4":
      case "feedback-5":
        return `Month ${screen.slice(-1)} · Results`;
      case "final":
        return "Internship Complete";
    }
  })();

  const showZ =
    screen.startsWith("primer-") ||
    screen.startsWith("quiz-") ||
    screen.startsWith("sim-");

  return (
    <AppShell contextLabel={ctx}>
      {screen === "overview" && (
        <PrimersOverview
          name={name}
          primers={PRIMER_META.map((p, i) => ({
            ...p,
            completed: completed[i],
          }))}
          onStart={startPrimer}
        />
      )}
      {screen === "primer-1" && (
        <PrimerMarketing
          onBack={() => setScreen("overview")}
          onQuiz={() => setScreen("quiz-1")}
        />
      )}
      {screen === "quiz-1" && (
        <Quiz
          title="Marketing Elasticity"
          step={0}
          questions={QUIZ_1}
          primerNumber={1}
          nextLabel="Continue to Primer 2"
          onComplete={(c) => completeQuiz(0, c)}
        />
      )}
      {screen === "primer-2" && (
        <PrimerNewsvendor
          onBack={() => setScreen("overview")}
          onQuiz={() => setScreen("quiz-2")}
        />
      )}
      {screen === "quiz-2" && (
        <Quiz
          title="Newsvendor Analysis"
          step={1}
          questions={QUIZ_2}
          primerNumber={2}
          nextLabel="Continue to Primer 3"
          onComplete={(c) => completeQuiz(1, c)}
        />
      )}
      {screen === "primer-3" && (
        <PrimerChannel
          onBack={() => setScreen("overview")}
          onQuiz={() => setScreen("quiz-3")}
        />
      )}
      {screen === "quiz-3" && (
        <Quiz
          title="Channel Strategy"
          step={2}
          questions={QUIZ_3}
          primerNumber={3}
          nextLabel="See Results"
          onComplete={(c) => completeQuiz(2, c)}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          name={name}
          score={totalScore}
          total={4}
          onRedo={redoAll}
          onProceed={() => setScreen("results")}
        />
      )}

      {showZ && <ZTableFloating />}
    </AppShell>
  );
}
