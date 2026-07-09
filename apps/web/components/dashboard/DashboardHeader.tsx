import { Plus, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  userEmail: string | undefined;
  onCreateCard: () => void;
};

export default function DashboardHeader({ userEmail, onCreateCard }: Props) {
  return (
    <>
      <h1 className="flex items-center gap-3 text-5xl font-bold text-foreground">
        <Sun className="size-10" />
        SUNPEO ZTOUCH
      </h1>

      <p className="mt-8 text-2xl text-foreground">Xin chào</p>

      <p className="mt-2 text-lg text-muted-foreground">{userEmail}</p>

      <Button type="button" size="lg" className="mt-8" onClick={onCreateCard}>
        <Plus className="size-4" />
        Tạo hồ sơ mới
      </Button>
    </>
  );
}
