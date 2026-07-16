import NotFoundState from "@/components/NotFoundState";

export default function NotFound() {
  return (
    <NotFoundState
      title="Không tìm thấy trang"
      message="Trang bạn tìm không tồn tại hoặc đã được di chuyển."
    />
  );
}
