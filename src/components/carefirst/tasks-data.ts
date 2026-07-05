export type TaskMeta = {
  id: number;
  title: string;
  shareable?: boolean;
};

export const CAREFIRST_TASKS: TaskMeta[] = [
  { id: 0, title: "Onboarding" },
  { id: 1, title: "Problem Framing" },
  { id: 2, title: "Patient Journey Mapping", shareable: true },
  { id: 3, title: "Timing Analysis" },
  { id: 4, title: "Root Cause Analysis" },
  { id: 5, title: "Recommend Interventions" },
  { id: 6, title: "Executive Recommendation Deck", shareable: true },
  { id: 7, title: "Prioritisation Under Constraint" },
  { id: 8, title: "Meet the Digital Partner", shareable: true },
  { id: 9, title: "Identify the Latency Problem" },
  { id: 10, title: "Root Cause via User Reviews" },
  { id: 11, title: "Recommend a Digital Fix" },
  { id: 12, title: "Build a Live KPI Dashboard", shareable: true },
  { id: 13, title: "Workforce Estimation" },
  { id: 14, title: "Forecasting Footfall" },
];

export const TOTAL_TASKS = CAREFIRST_TASKS.length;
export const SHAREABLE_COUNT = CAREFIRST_TASKS.filter((t) => t.shareable).length;