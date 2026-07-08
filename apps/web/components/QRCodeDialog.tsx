"use client";

import QRCode from "react-qr-code";

type Props = {
  publicId: string;
};

export default function QRCodeDialog({ publicId }: Props) {
  const url =
    `${window.location.origin}/p/${publicId}`;

  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-4 text-xl font-bold">
        QR Code
      </h2>

      <div className="flex justify-center">

        <QRCode
          value={url}
          size={220}
        />

      </div>

      <p className="mt-4 break-all text-center text-sm">
        {url}
      </p>

    </div>
  );
}