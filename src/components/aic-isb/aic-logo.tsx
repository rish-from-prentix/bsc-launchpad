import aicIsbLogo from "@/assets/aic-isb-logo.png";
import { cn } from "@/lib/utils";

export function AicIsbLogo({
  className,
  height = 44,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <img
      src={aicIsbLogo}
      alt="AIC × ISB"
      style={{ height: `${height}px`, width: "auto" }}
      className={cn("select-none", className)}
      draggable={false}
    />
  );
}