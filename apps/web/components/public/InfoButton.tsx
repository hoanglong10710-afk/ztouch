import type { LucideIcon } from "lucide-react";

type Props = {
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
};

export default function InfoButton({ href, icon: Icon, label, external }: Props) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center justify-center gap-2 rounded-xl bg-secondary p-4 text-center font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
    >
      <Icon className="size-5" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
