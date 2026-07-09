import Image from "next/image";

type Props = {
  name: string;
  jobTitle: string | null;
  bio: string | null;
  avatarUrl: string | null;
};

export default function ProfileHeader({ name, jobTitle, bio, avatarUrl }: Props) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={avatarUrl || "https://placehold.co/200x200"}
        alt={name}
        width={144}
        height={144}
        className="h-36 w-36 rounded-full border border-border object-cover"
      />

      <h1 className="mt-6 text-3xl font-bold text-foreground">{name}</h1>

      {jobTitle && <p className="mt-2 text-muted-foreground">{jobTitle}</p>}

      {bio && (
        <p className="mt-6 whitespace-pre-wrap text-center text-foreground">
          {bio}
        </p>
      )}
    </div>
  );
}
