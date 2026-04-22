import bscLogo from "@/assets/bsc-logo.png";
import prentixLogo from "@/assets/prentix-logo.png";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  brand: "bsc" | "prentix";
  className?: string;
  height?: number;
};

export function BrandMark({ brand, className, height = 24 }: BrandMarkProps) {
  const src = brand === "bsc" ? bscLogo : prentixLogo;
  const alt = brand === "bsc" ? "Bombay Shaving Company" : "Prentix";
  return (
    <img
      src={src}
      alt={alt}
      style={{ height: `${height}px`, width: "auto" }}
      className={cn("brand-invert select-none", className)}
      draggable={false}
    />
  );
}