"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  name: string;
  jobTitle: string | null;
  bio: string | null;
  avatarUrl: string | null;
};

const FALLBACK_AVATAR = "https://placehold.co/200x200";

export default function ProfileHeader({ name, jobTitle, bio, avatarUrl }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <header className="flex flex-col items-center">
      <Image
        src={!imageFailed && avatarUrl ? avatarUrl : FALLBACK_AVATAR}
        alt={name}
        width={144}
        height={144}
        className="h-36 w-36 rounded-full border border-border object-cover"
        onError={() => setImageFailed(true)}
      />

      <h1 className="mt-6 text-3xl font-bold text-foreground">{name}</h1>

      {jobTitle && <p className="mt-2 text-muted-foreground">{jobTitle}</p>}

      {bio && (
        <p className="mt-6 whitespace-pre-wrap text-center text-foreground">
          {bio}
        </p>
      )}
    </header>
  );
}
