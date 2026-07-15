"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  label?: string;
  iconOnly?: boolean;
  className?: string;
};

// iconOnly renders a compact square button (icon, no text) for placement
// inside tight rows like contact-action items -- the copy/state logic is
// unchanged, only the rendering shrinks and the state moves from visible
// text to aria-label so screen readers still get the "copied" announcement.
export default function CopyButton({ value, label = "Sao chép", iconOnly = false, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable or permission denied — nothing else to do.
    }
  }

  const statusLabel = copied ? "Đã sao chép" : label;

  return (
    <Button
      type="button"
      variant="outline"
      size={iconOnly ? "icon-lg" : "default"}
      onClick={handleCopy}
      aria-label={iconOnly ? statusLabel : undefined}
      className={cn(className)}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {!iconOnly && statusLabel}
    </Button>
  );
}
