import { useState } from "react";
import { Sigma, X } from "lucide-react";

const ROWS: Array<[string, string]> = [
  ["0.50", "0.00"],
  ["0.60", "0.25"],
  ["0.70", "0.52"],
  ["0.75", "0.67"],
  ["0.80", "0.84"],
  ["0.85", "1.04"],
  ["0.87", "1.13"],
  ["0.90", "1.28"],
  ["0.94", "1.55"],
  ["0.95", "1.65"],
  ["0.97", "1.88"],
  ["0.99", "2.33"],
];

export function ZTableFloating() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all hover:border-primary hover:text-primary"
        aria-label="Toggle Z-table"
      >
        <Sigma className="h-3.5 w-3.5" />
        Z-table
      </button>
      {open && (
        <div
          className="fixed bottom-36 right-5 z-40 w-72 rounded-xl border border-border bg-card p-5 shadow-[0_12px_48px_rgba(0,0,0,0.6)]"
          style={{ animation: "fadeSlide 220ms ease-out" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary">
                Reference
              </div>
              <div className="text-sm font-semibold mt-0.5">Z-score table</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-primary">
                <th className="text-left font-medium pb-2">Critical Ratio</th>
                <th className="text-right font-medium pb-2">Z-Score</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([cr, z], i) => (
                <tr
                  key={cr}
                  className={i % 2 === 0 ? "bg-secondary/40" : ""}
                >
                  <td className="py-1.5 px-2">{cr}</td>
                  <td className="py-1.5 px-2 text-right">{z}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}