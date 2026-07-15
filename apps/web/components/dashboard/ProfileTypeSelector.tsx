"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ProfileType } from "@/types/card";

type Option = {
  value: ProfileType;
  icon: string;
  label: string;
  description: string;
};

const OPTIONS: Option[] = [
  {
    value: "personal",
    icon: "👤",
    label: "Hồ sơ cá nhân",
    description: "Dùng để chia sẻ thông tin, mạng xã hội, danh thiếp số.",
  },
  {
    value: "rescue",
    icon: "🩺",
    label: "Hồ sơ cứu hộ",
    description: "Dùng để lưu thông tin y tế và liên hệ khẩn cấp.",
  },
];

type Props = {
  onCancel: () => void;
  onContinue: (profileType: ProfileType) => void;
  creating?: boolean;
};

export default function ProfileTypeSelector({ onCancel, onContinue, creating }: Props) {
  const [selected, setSelected] = useState<ProfileType>("personal");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Chọn loại hồ sơ</DialogTitle>
      </DialogHeader>

      <div className="space-y-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected === option.value}
            disabled={creating}
            onClick={() => setSelected(option.value)}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
              selected === option.value && "border-primary ring-2 ring-primary"
            )}
          >
            <span className="text-2xl" aria-hidden="true">
              {option.icon}
            </span>

            <div>
              <p className="font-medium text-foreground">{option.label}</p>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={creating}>
          Hủy
        </Button>

        <Button
          type="button"
          onClick={() => onContinue(selected)}
          disabled={creating}
          aria-busy={creating}
        >
          {creating ? "Đang tạo..." : "Tiếp tục"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
