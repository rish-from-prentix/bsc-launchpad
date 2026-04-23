import bscLogo from "@/assets/bsc-logo.png";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  brand: "bsc" | "prentix";
  className?: string;
  height?: number;
};

export function BrandMark({ brand, className, height = 24 }: BrandMarkProps) {
  const src = brand === "bsc" ? bscLogo : "https://i.postimg.cc/vTZZd43D/b7da5e58-f3dc-4a2b-8ea0-3796b5f42f4c.png";
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