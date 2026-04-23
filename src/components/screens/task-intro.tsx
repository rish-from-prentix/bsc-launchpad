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
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
        Day One
      </div>
      <h1 className="mt-2 text-[28px] sm:text-[32px] font-bold tracking-tight text-foreground">
        Your Internship Starts Now
      </h1>
      <div className="mt-5 text-[15px] text-foreground/85 leading-[1.7] space-y-3">
        <p>
          Congratulations on starting your journey off as a Growth & Business Ops intern.
        </p>
        <p>
          Over the next 5 months, you will be responsible for managing inventory and
          marketing budgets for 3 of Bombay Shaving Company's SKUs across 3 cities:
          Bangalore, Bombay and Hyderabad.
        </p>
        <p>
          Your goal is to maximize total profit (EBITDA), while maintaining brand trust
          and loyalty.
        </p>
      </div>

      <div className="mt-8">
        <EventEmail
          sender="Shantanu Deshpande"
          initials="SD"
          subject="Welcome to the team"
          body={body}
          collapsible={false}
        />
      </div>

      <div className="mt-10">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-3">
          What you can do each month
        </div>
        <ul className="space-y-2.5 text-[14px] text-foreground/85 leading-[1.65]">
          {[
            "Reallocate monthly marketing budgets between SKUs and geographies.",
            "Update inventory levels as per expected demand.",
            "In Hyderabad, choose where to place orders from: Nearby manufacturer (faster delivery, higher cost) or Faraway manufacturer (lower cost, longer lead time).",
            "Any additional inventory ordered will be charged from your budget.",
            "While you can decrease inventory to increase your budget, the company loses ₹30 on every unit returned. So you will only get back (unit cost minus ₹30).",
            "You can use Newsvendor analysis to identify optimal inventory levels or order as per your judgement. However, consider macro factors while tweaking inventory levels.",
            "You will be making budget and inventory decisions at the start of each month. No changes can be made in between months.",
          ].map((t, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="text-primary mt-1.5 shrink-0">▸</span>
              <span>{t}</span>
            </li>
          ))}
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