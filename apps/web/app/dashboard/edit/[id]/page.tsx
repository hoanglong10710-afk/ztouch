"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCodePanel from "@/components/QRCodePanel";
import ShareButton from "@/components/ShareButton";
import EditForm from "./EditForm";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import { validateCard, hasErrors } from "@/lib/validation/card";
import { validatePublicId } from "@/lib/validation/public-id";
import {
  validateRescueForm,
  validateEmergencyContact,
  hasErrors as hasRescueErrors,
  EMPTY_RESCUE_FORM,
} from "@/lib/validation/rescue";
import { updateCard as updateCardAction } from "./actions";
import { upsertRescueProfile, saveEmergencyContacts } from "./rescue-actions";
import { toast } from "@/components/ui/toast";
import { readFirstProfile, clearFirstProfile } from "@/lib/onboarding/first-profile";
import { markLastCompletedProfile } from "@/lib/onboarding/last-completed-profile";
import type { Card } from "@/types/card";
import type { RescueFormValues, EmergencyContactFormValues } from "@/lib/validation/rescue";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [card, setCard] = useState<Card | null>(null);
  const [initialCard, setInitialCard] = useState<Card | null>(null);
  const [rescueForm, setRescueForm] = useState<RescueFormValues>(EMPTY_RESCUE_FORM);
  const [initialRescueForm, setInitialRescueForm] =
    useState<RescueFormValues>(EMPTY_RESCUE_FORM);
  const [contacts, setContacts] = useState<EmergencyContactFormValues[]>([]);
  const [initialContacts, setInitialContacts] = useState<EmergencyContactFormValues[]>([]);
  const [showReadyDialog, setShowReadyDialog] = useState(false);
  // Uniqueness can only be checked server-side, so a rejected value is
  // remembered here and surfaced through the same inline error slot as the
  // client-side slug validation -- cleared implicitly once the owner edits
  // public_id away from the rejected value (see `errors` below).
  const [publicIdConflict, setPublicIdConflict] = useState<{
    value: string;
    message: string;
  } | null>(null);

  // sessionStorage never changes for the lifetime of this page, so there is
  // nothing to subscribe to -- this only needs a snapshot, read safely on
  // both server (no sessionStorage) and client via useSyncExternalStore.
  const isFirstProfile = useSyncExternalStore(
    () => () => {},
    () => readFirstProfile()?.cardId === id,
    () => false
  );

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const userId = user.id;
    let ignore = false;

    async function loadCard() {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("id", id)
        .eq("owner_id", userId)
        .single();

      if (ignore) return;

      if (error) {
        toast.error(error.message);
        return;
      }

      setCard(data as Card);
      setInitialCard(data as Card);

      if (data.profile_type === "rescue") {
        const [{ data: rescueProfile }, { data: contactRows }] = await Promise.all([
          supabase.from("rescue_profiles").select("*").eq("card_id", id).maybeSingle(),
          supabase
            .from("emergency_contacts")
            .select("*")
            .eq("card_id", id)
            .order("priority", { ascending: true }),
        ]);

        if (ignore) return;

        const loadedRescueForm: RescueFormValues = {
          bloodType: rescueProfile?.blood_type ?? "",
          allergies: rescueProfile?.allergies ?? "",
          medicalConditions: rescueProfile?.medical_conditions ?? "",
          medications: rescueProfile?.medications ?? "",
        };

        const loadedContacts: EmergencyContactFormValues[] = (contactRows ?? []).map((row) => ({
          id: row.id,
          fullName: row.full_name ?? "",
          relationship: row.relationship ?? "",
          phone: row.phone ?? "",
          priority: row.priority,
          isPrimary: row.is_primary,
        }));

        setRescueForm(loadedRescueForm);
        setInitialRescueForm(loadedRescueForm);
        setContacts(loadedContacts);
        setInitialContacts(loadedContacts);
      }

      setLoading(false);
    }

    loadCard();

    return () => {
      ignore = true;
    };
  }, [authLoading, user, id]);

  async function saveCard() {
    if (!card) return;

    setSaving(true);

    const result = await updateCardAction(id, card, initialCard?.public_id ?? card.public_id);

    if (!result.success) {
      setSaving(false);
      if (result.fieldErrors?.public_id) {
        setPublicIdConflict({ value: card.public_id, message: result.fieldErrors.public_id });
      }
      toast.error(result.error);
      return;
    }

    if (card.profile_type === "rescue") {
      const rescueProfileResult = await upsertRescueProfile(id, {
        bloodType: rescueForm.bloodType,
        allergies: rescueForm.allergies,
        medicalConditions: rescueForm.medicalConditions,
        medications: rescueForm.medications,
      });

      if (!rescueProfileResult.success) {
        setSaving(false);
        toast.error(rescueProfileResult.error);
        return;
      }

      const contactsResult = await saveEmergencyContacts(id, contacts);

      if (!contactsResult.success) {
        setSaving(false);
        toast.error(contactsResult.error);
        return;
      }

      setContacts(contactsResult.contacts);
      setInitialContacts(contactsResult.contacts);
    }

    setSaving(false);
    setInitialCard(card);
    setInitialRescueForm(rescueForm);
    toast.success("✅ Đã lưu thành công!");

    if (isFirstProfile) {
      clearFirstProfile();
      setShowReadyDialog(true);
    }
  }

  const errors = useMemo(() => {
    if (!card) return {};

    const baseErrors = validateCard(card);

    // Legacy public_ids predate the vanity-slug rules and must keep
    // working untouched -- only enforce the slug format (and any
    // server-checked uniqueness conflict) once the owner actually edits it.
    if (card.public_id !== initialCard?.public_id) {
      const publicIdError =
        validatePublicId(card.public_id) ??
        (publicIdConflict?.value === card.public_id ? publicIdConflict.message : undefined);
      if (publicIdError) {
        return { ...baseErrors, public_id: publicIdError };
      }
    }

    return baseErrors;
  }, [card, initialCard, publicIdConflict]);
  const rescueErrors = useMemo(
    () => (card?.profile_type === "rescue" ? validateRescueForm(rescueForm) : {}),
    [card, rescueForm]
  );
  const contactErrors = useMemo(
    () => (card?.profile_type === "rescue" ? contacts.map(validateEmergencyContact) : []),
    [card, contacts]
  );
  const hasContactErrors = contactErrors.some((e) => hasRescueErrors(e));
  const isDirty = useMemo(() => {
    const cardChanged = JSON.stringify(card) !== JSON.stringify(initialCard);
    const rescueChanged =
      card?.profile_type === "rescue" &&
      (JSON.stringify(rescueForm) !== JSON.stringify(initialRescueForm) ||
        JSON.stringify(contacts) !== JSON.stringify(initialContacts));
    return cardChanged || rescueChanged;
  }, [card, initialCard, rescueForm, initialRescueForm, contacts, initialContacts]);
  const canSave =
    isDirty && !hasErrors(errors) && !hasRescueErrors(rescueErrors) && !hasContactErrors && !saving;

  if (authLoading || loading || !card) {
    return <LoadingScreen />;
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-10" data-first-profile={isFirstProfile}>
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        className="mb-4 sm:mb-6"
      >
        <ArrowLeft className="size-4" />
        Quay lại
      </Button>

      <h1 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-4xl">✏️ Chỉnh sửa hồ sơ</h1>

      {isFirstProfile && (
        <section
          aria-labelledby="first-profile-banner-title"
          className="mb-6 rounded-lg border border-border bg-muted p-4 sm:mb-8"
        >
          <h2
            id="first-profile-banner-title"
            className="flex items-center gap-2 text-base font-semibold text-foreground"
          >
            <PartyPopper className="size-5 shrink-0" aria-hidden="true" />
            🎉 Hồ sơ đầu tiên của bạn đã được tạo
          </h2>

          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>Điền đầy đủ thông tin rồi nhấn “Lưu thay đổi”.</p>
            <p>Sau đó bạn sẽ có thể chia sẻ hồ sơ bằng QR hoặc NFC.</p>
          </div>
        </section>
      )}

      <EditForm
        card={card}
        setCard={setCard}
        errors={errors}
        rescueForm={rescueForm}
        setRescueForm={setRescueForm}
        contacts={contacts}
        setContacts={setContacts}
        contactErrors={contactErrors}
      />

      <Button
        onClick={saveCard}
        disabled={!canSave}
        size="lg"
        className="mt-6 w-full sm:w-auto"
      >
        {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
      </Button>

      <Dialog open={showReadyDialog} onOpenChange={setShowReadyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎉 Hồ sơ của bạn đã sẵn sàng</DialogTitle>
            <DialogDescription>
              Hồ sơ của bạn đã có thể chia sẻ bằng mã QR hoặc đường liên kết.
            </DialogDescription>
          </DialogHeader>

          <QRCodePanel url={`${window.location.origin}/p/${card.public_id}`} />

          <ShareButton
            url={`${window.location.origin}/p/${card.public_id}`}
            title={card.title ?? undefined}
          />

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Viết vào thẻ NFC</h3>

            <p className="text-sm text-muted-foreground">
              Bạn có thể ghi chính đường liên kết này vào một thẻ NFC bằng các ứng dụng ghi
              NFC phổ biến trên Android hoặc iPhone.
            </p>

            <p className="text-sm text-muted-foreground">
              Sau khi ghi xong, chỉ cần chạm điện thoại vào thẻ để mở hồ sơ ngay lập tức.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
            Đường dẫn được ghi chính là URL hiển thị phía trên.
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setShowReadyDialog(false);
                markLastCompletedProfile({ cardId: card.id });
                router.push("/dashboard");
              }}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
