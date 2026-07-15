import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
  variant?: "default" | "emergency";
  ariaLabel?: string;
};

// "emergency" is reserved for the one action on a rescue profile that should
// outrank every other InfoButton -- the primary emergency contact's call
// button -- so it stays visually distinct from routine contact/social links.
const VARIANT_CLASSES: Record<NonNullable<Props["variant"]>, string> = {
  default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  emergency: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
};

export default function InfoButton({
  href,
  icon: Icon,
  label,
  external,
  variant = "default",
  ariaLabel,
}: Props) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl p-4 text-center font-medium transition-colors",
        VARIANT_CLASSES[variant]
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className="min-w-0 truncate">{label}</span>
    </a>
  );
}
