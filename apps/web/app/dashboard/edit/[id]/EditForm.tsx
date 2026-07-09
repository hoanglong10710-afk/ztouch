"use client";

import type { Card, CardStringField } from "@/types/card";
import type { CardFormErrors } from "@/lib/validation/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type Props = {
  card: Card;
  setCard: (card: Card) => void;
  errors: CardFormErrors;
};

type FieldDef = { name: CardStringField; label: string };

const BASIC_FIELDS: FieldDef[] = [
  { name: "title", label: "Tiêu đề" },
  { name: "display_name", label: "Tên hiển thị" },
  { name: "job_title", label: "Nghề nghiệp" },
  { name: "company", label: "Công ty" },
];

const CONTACT_FIELDS: FieldDef[] = [
  { name: "phone", label: "Điện thoại" },
  { name: "email", label: "Email" },
  { name: "website", label: "Website" },
  { name: "address", label: "Địa chỉ" },
];

const SOCIAL_FIELDS: FieldDef[] = [
  { name: "facebook", label: "Facebook" },
  { name: "tiktok", label: "TikTok" },
  { name: "youtube", label: "Youtube" },
  { name: "instagram", label: "Instagram" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "github", label: "GitHub" },
];

export default function EditForm({ card, setCard, errors }: Props) {
  function updateField(name: CardStringField, value: string) {
    setCard({
      ...card,
      [name]: value,
    });
  }

  function renderField({ name, label }: FieldDef) {
    const error = errors[name];

    return (
      <div key={name} className="space-y-1.5">
        <Label htmlFor={name}>{label}</Label>

        <Input
          id={name}
          value={card[name] || ""}
          aria-invalid={!!error}
          onChange={(e) => updateField(name, e.target.value)}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

        <div className="space-y-6">
          {BASIC_FIELDS.map(renderField)}

          <div className="space-y-1.5">
            <Label htmlFor="bio">Giới thiệu</Label>

            <Textarea
              id="bio"
              rows={6}
              value={card.bio || ""}
              onChange={(e) => updateField("bio", e.target.value)}
            />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Liên hệ</h2>

        <div className="space-y-6">{CONTACT_FIELDS.map(renderField)}</div>
      </section>

      <Separator />

      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Mạng xã hội</h2>

        <div className="space-y-6">{SOCIAL_FIELDS.map(renderField)}</div>
      </section>
    </div>
  );
}
