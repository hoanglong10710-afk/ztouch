import { ExternalLink } from "lucide-react";

type Props = {
  href: string;
  label: string;
};

export default function SocialButton({ href, label }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (mở tab mới)`}
      className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 text-center font-medium text-foreground transition-colors hover:bg-muted"
    >
      <span className="min-w-0 truncate">{label}</span>
      <ExternalLink className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
    </a>
  );
}
