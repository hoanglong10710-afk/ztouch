"use client";

import type { Card, CardStringField } from "@/types/card";
import type { CardFormErrors } from "@/lib/validation/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import AvatarUploader from "@/components/dashboard/AvatarUploader";
import { PROFILE_TYPE_LABELS } from "@/lib/profile-type";
import type { RescueFormErrors, RescueFormValues } from "@/lib/validation/rescue";

type Props = {
  card: Card;
  setCard: (card: Card) => void;
  errors: CardFormErrors;
  rescueForm: RescueFormValues;
  setRescueForm: (values: RescueFormValues) => void;
  rescueErrors: RescueFormErrors;
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

export default function EditForm({
  card,
  setCard,
  errors,
  rescueForm,
  setRescueForm,
  rescueErrors,
}: Props) {
  function updateField(name: CardStringField, value: string) {
    setCard({
      ...card,
      [name]: value,
    });
  }

  function updateRescueField(name: keyof RescueFormValues, value: string) {
    setRescueForm({
      ...rescueForm,
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
    <div className="mt-6 space-y-8 sm:mt-8 sm:space-y-10">
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label>Loại hồ sơ</Label>
            <p className="text-foreground">{PROFILE_TYPE_LABELS[card.profile_type]}</p>
          </div>

          <AvatarUploader
            cardId={card.id}
            avatarUrl={card.avatar_url}
            onUploaded={(url) => updateField("avatar_url", url)}
          />

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div className="space-y-1">
              <Label htmlFor="is_public">Công khai hồ sơ</Label>
              <p className="text-sm text-muted-foreground">
                Khi tắt, hồ sơ sẽ không thể truy cập qua NFC, QR hoặc liên kết công khai.
              </p>
            </div>

            <Switch
              id="is_public"
              aria-label="Công khai hồ sơ"
              checked={card.is_public}
              onCheckedChange={(checked) => setCard({ ...card, is_public: checked })}
            />
          </div>

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

      {card.profile_type === "rescue" && (
        <>
          <Separator />

          <section className="space-y-6">
            <h2 className="text-lg font-semibold">Thông tin y tế</h2>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="rescue_blood_type">Nhóm máu</Label>
                <Input
                  id="rescue_blood_type"
                  value={rescueForm.bloodType}
                  onChange={(e) => updateRescueField("bloodType", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rescue_allergies">Dị ứng</Label>
                <Textarea
                  id="rescue_allergies"
                  rows={3}
                  value={rescueForm.allergies}
                  onChange={(e) => updateRescueField("allergies", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rescue_medical_conditions">Tình trạng bệnh lý</Label>
                <Textarea
                  id="rescue_medical_conditions"
                  rows={3}
                  value={rescueForm.medicalConditions}
                  onChange={(e) => updateRescueField("medicalConditions", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rescue_medications">Thuốc đang sử dụng</Label>
                <Textarea
                  id="rescue_medications"
                  rows={3}
                  value={rescueForm.medications}
                  onChange={(e) => updateRescueField("medications", e.target.value)}
                />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-6">
            <h2 className="text-lg font-semibold">Liên hệ khẩn cấp</h2>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="rescue_contact_full_name">Họ tên</Label>
                <Input
                  id="rescue_contact_full_name"
                  value={rescueForm.contactFullName}
                  aria-invalid={!!rescueErrors.contactFullName}
                  onChange={(e) => updateRescueField("contactFullName", e.target.value)}
                />
                {rescueErrors.contactFullName && (
                  <p className="text-sm text-destructive">{rescueErrors.contactFullName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rescue_contact_relationship">Mối quan hệ</Label>
                <Input
                  id="rescue_contact_relationship"
                  value={rescueForm.contactRelationship}
                  onChange={(e) => updateRescueField("contactRelationship", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rescue_contact_phone">Số điện thoại</Label>
                <Input
                  id="rescue_contact_phone"
                  value={rescueForm.contactPhone}
                  aria-invalid={!!rescueErrors.contactPhone}
                  onChange={(e) => updateRescueField("contactPhone", e.target.value)}
                />
                {rescueErrors.contactPhone && (
                  <p className="text-sm text-destructive">{rescueErrors.contactPhone}</p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
