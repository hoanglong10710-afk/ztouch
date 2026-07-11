"use client";

import { QrCode as QrCodeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCodePanel from "@/components/QRCodePanel";

type Props = {
  publicId: string;
};

export default function QRCodeDialog({ publicId }: Props) {
  const url = `${window.location.origin}/p/${publicId}`;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button type="button" variant="outline">
            <QrCodeIcon className="size-4" />
            QR
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mã QR hồ sơ</DialogTitle>
          <DialogDescription>
            Quét mã để mở trang hồ sơ công khai.
          </DialogDescription>
        </DialogHeader>

        <QRCodePanel url={url} />
      </DialogContent>
    </Dialog>
  );
}
