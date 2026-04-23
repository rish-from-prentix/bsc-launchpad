import bscLogo from "@/assets/bsc-logo.png";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  brand: "bsc" | "prentix";
  className?: string;
  height?: number;
};

const PRENTIX_SRC = "https://i.postimg.cc/c13v03x8/b7da5e58-f3dc-4a2b-8ea0-3796b5f42f4c.png";

export function BrandMark({ brand, className, height = 24 }: BrandMarkProps) {
  if (brand === "prentix") {
    const width = Math.max(height * 2.5, 80);
    return (
      <img
        src={PRENTIX_SRC}
        alt="Prentix"
        style={{ width: `${width}px`, height: "auto", mixBlendMode: "screen" }}
        className={cn("select-none", className)}
        draggable={false}
      />
    );
  }
  return (
    <img
      src={bscLogo}
      alt="Bombay Shaving Company"
      style={{ height: `${height}px`, width: "auto" }}
      className={cn("brand-invert select-none", className)}
      draggable={false}
    />
  );
}