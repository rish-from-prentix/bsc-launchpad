import bscLogo from "@/assets/bsc-logo.png";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  brand: "bsc" | "prentix";
  className?: string;
  height?: number;
};

export function BrandMark({ brand, className, height = 24 }: BrandMarkProps) {
  const src = brand === "bsc" ? bscLogo : "https://drive.usercontent.google.com/download?id=1nVqOsuJxkXgf2cDde4BARfJgf8lIckyq&export=view&authuser=0";
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