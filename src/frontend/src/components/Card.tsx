import { cn } from "@/lib/utils";
import type { KeyboardEvent, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  variant?: "default" | "featured" | "glass";
  onClick?: () => void;
  "data-ocid"?: string;
}

export function Card({
  children,
  className,
  hover = true,
  glow = false,
  variant = "default",
  onClick,
  "data-ocid": dataOcid,
}: CardProps) {
  const isInteractive = typeof onClick === "function";

  const base =
    "relative rounded-lg border bg-card text-card-foreground overflow-hidden transition-all duration-200";

  const variants = {
    default: "border-border",
    featured: "border-primary/40",
    glass: "border-border",
  };

  const hoverStyles =
    hover && isInteractive
      ? "hover:border-primary/50 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer"
      : "";

  const glowStyles = glow ? "shadow-orange-glow" : "";

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;

    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={cn(
        base,
        variants[variant],
        hoverStyles,
        glowStyles,
        className,
      )}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      data-ocid={dataOcid}
    >
      {variant === "featured" && (
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/70" />
      )}
      {children}
    </div>
  );
}

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardSectionProps) {
  return <div className={cn("p-6 pb-4", className)}>{children}</div>;
}

export function CardBody({ children, className }: CardSectionProps) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div className={cn("px-6 py-4 border-t border-border/40", className)}>
      {children}
    </div>
  );
}

interface TagProps {
  children: ReactNode;
  variant?: "orange" | "silver";
}

export function Tag({ children, variant = "orange" }: TagProps) {
  return (
    <span className={variant === "orange" ? "tag-pill" : "tag-pill-silver"}>
      {children}
    </span>
  );
}
