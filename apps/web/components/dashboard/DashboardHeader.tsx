type Props = {
  userEmail: string | undefined;
  onCreateCard: () => void;
};

export default function DashboardHeader({ userEmail, onCreateCard }: Props) {
  return (
    <>
      <h1 className="text-5xl font-bold">
        ☀️ SUNPEO ZTOUCH
      </h1>

      <p className="mt-8 text-2xl">
        Xin chào
      </p>

      <p className="mt-2 text-lg">
        {userEmail}
      </p>

      <button
        onClick={onCreateCard}
        className="mt-8 rounded-xl bg-blue-600 px-8 py-4 text-lg text-white hover:bg-blue-700"
      >
        + Tạo hồ sơ mới
      </button>
    </>
  );
}
