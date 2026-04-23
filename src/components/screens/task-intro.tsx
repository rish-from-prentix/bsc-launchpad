import { ArrowRight } from "lucide-react";
import { EventEmail } from "./sim/event-email";
import { SHANTANU_WELCOME_BODY } from "@/lib/simulation";

export function TaskIntro({ name, onBegin }: { name: string; onBegin: () => void }) {
  const body = SHANTANU_WELCOME_BODY.replace("[Name]", name || "there");

  return (
    <div
      className="mx-auto max-w-[680px] px-5 sm:px-8 py-10 sm:py-14"
      style={{ animation: "fadeSlide 280ms ease-out" }}
    >
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">Day One</div>
      <h1 className="mt-2 text-[28px] sm:text-[32px] font-bold tracking-tight text-foreground">
        Your Internship Starts Now
      </h1>
      <div className="mt-5 text-[15px] text-foreground/85 leading-[1.7] space-y-3">
        <p>Congratulations on starting your journey off as a Growth & Business Ops intern.</p>
        <p>
          Over the next 5 months, you will be responsible for managing inventory and marketing budgets for 3 of Bombay
          Shaving Company's SKUs across 3 cities: Bangalore, Bombay and Hyderabad.
        </p>
        <p>Your goal is to maximize total profit (EBITDA), while maintaining brand trust and loyalty.</p>
      </div>

      <div className="mt-10">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-3">
          What you can do each month
        </div>
        <ul className="space-y-2.5 text-[14px] text-foreground/85 leading-[1.65]">
          <li className="flex gap-2.5">
            <span className="text-primary mt-1.5 shrink-0">▸</span>
            <span>Reallocate monthly marketing budgets between SKUs and geographies.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-primary mt-1.5 shrink-0">▸</span>
            <div className="flex flex-col gap-2">
              <span>Update inventory levels as per expected demand.</span>
              <ul className="space-y-2 mt-1 ml-2 border-l border-primary/30 pl-4">
                <li className="text-foreground/70">
                  In Hyderabad, you have a sourcing choice each month. A nearby manufacturer delivers in 2 weeks at a
                  higher cost. A faraway manufacturer delivers in about a month at a lower cost. Choose based on how
                  urgently you need the stock.
                </li>
                <li className="text-foreground/70">
                  Any additional units ordered beyond what you already have in stock will be charged from your monthly
                  budget.
                </li>
                <li className="text-foreground/70">
                  You can also reduce inventory to free up budget. Keep in mind that the company loses ₹30 on every unit
                  returned, so you get back the unit cost minus ₹30 per unit.
                </li>
                <li className="text-foreground/70">
                  You can use Newsvendor analysis to arrive at optimal inventory levels, or simply use your judgement.
                  Either way, factor in any macro signals you have for that month before finalising your numbers.
                </li>
              </ul>
            </div>
          </li>
          <li className="flex gap-2.5">
            <span className="text-primary mt-1.5 shrink-0">▸</span>
            <span>
              You will be making budget and inventory decisions at the start of each month. No changes can be made in
              between months.
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={onBegin}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          style={{ animation: "softPulse 2.4s ease-in-out infinite" }}
        >
          Begin Month 1 <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
