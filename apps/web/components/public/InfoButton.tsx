import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CopyButton from "@/components/CopyButton";

type Props = {
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
  variant?: "default" | "emergency";
  ariaLabel?: string;
  download?: boolean;
  copyValue?: string;
  copyLabel?: string;
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
  download,
  copyValue,
  copyLabel,
}: Props) {
  const hasCopy = Boolean(copyValue);

  return (
    <div className={cn("flex items-center rounded-xl transition-colors", VARIANT_CLASSES[variant])}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        download={download}
        aria-label={ariaLabel}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 p-4 font-medium",
          hasCopy ? "justify-start text-left" : "justify-center text-center"
        )}
      >
        <Icon className="size-5 shrink-0" aria-hidden="true" />
        <span className="min-w-0 truncate">{label}</span>
      </a>

      {hasCopy && (
        <CopyButton
          value={copyValue!}
          label={copyLabel ?? "Sao chép"}
          iconOnly
          className="mr-3 shrink-0 border-transparent bg-transparent hover:bg-background/60"
        />
      )}
    </div>
  );
}
