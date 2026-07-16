export const PUBLIC_ID_RESERVED_WORDS = [
  "admin",
  "api",
  "dashboard",
  "login",
  "logout",
  "edit",
  "new",
  "settings",
  "help",
  "support",
  "p",
  "www",
];

const PUBLIC_ID_MIN_LENGTH = 3;
const PUBLIC_ID_MAX_LENGTH = 30;

// Lowercase letters, digits and single internal hyphens only -- no leading,
// trailing, or duplicated hyphens.
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function validatePublicId(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Đường dẫn công khai là bắt buộc";
  }

  if (trimmed.length < PUBLIC_ID_MIN_LENGTH || trimmed.length > PUBLIC_ID_MAX_LENGTH) {
    return `Đường dẫn phải có từ ${PUBLIC_ID_MIN_LENGTH} đến ${PUBLIC_ID_MAX_LENGTH} ký tự`;
  }

  if (!SLUG_PATTERN.test(trimmed)) {
    return "Chỉ được dùng chữ thường (a-z), số (0-9) và dấu gạch ngang, không có khoảng trắng, không bắt đầu/kết thúc hoặc lặp dấu gạch ngang";
  }

  if (PUBLIC_ID_RESERVED_WORDS.includes(trimmed)) {
    return "Đường dẫn này đã được hệ thống sử dụng, vui lòng chọn đường dẫn khác";
  }

  return undefined;
}
