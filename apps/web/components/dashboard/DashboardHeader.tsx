import { Plus, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  userEmail: string | undefined;
  onCreateCard: () => void;
};

export default function DashboardHeader({ userEmail, onCreateCard }: Props) {
  return (
    <>
      <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground sm:gap-3 sm:text-5xl">
        <Sun className="size-7 sm:size-10" />
        SUNPEO ZTOUCH
      </h1>

      <p className="mt-6 text-xl text-foreground sm:mt-8 sm:text-2xl">Xin chào</p>

      <p className="mt-2 text-base text-muted-foreground sm:text-lg">{userEmail}</p>

      <Button
        type="button"
        size="lg"
        className="mt-6 w-full sm:mt-8 sm:w-auto"
        onClick={onCreateCard}
      >
        <Plus className="size-4" />
        Tạo hồ sơ mới
      </Button>
    </>
  );
}
