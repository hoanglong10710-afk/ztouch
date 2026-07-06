# ============================================================
# 02_PRODUCT.md
# ============================================================

Version: 1.0.0

Status: Draft

Owner: Product Team

Last Updated:

---

# CHƯƠNG 1

# PRODUCT OVERVIEW

---

## 1.1 Giới thiệu

Z-TOUCH là nền tảng quản lý hồ sơ số thông minh sử dụng công nghệ NFC và QR Code.

Người dùng chỉ cần chạm điện thoại vào NFC hoặc quét QR là có thể xem thông tin mà chủ sở hữu muốn chia sẻ.

Z-TOUCH không phải là website tạo link.

Z-TOUCH cũng không phải Linktree.

Đây là nền tảng Digital Identity.

Mỗi người dùng có thể sở hữu nhiều hồ sơ khác nhau và chủ động quyết định hồ sơ nào sẽ được chia sẻ.

---

## 1.2 Mục tiêu sản phẩm

Sản phẩm được xây dựng để giải quyết vấn đề chia sẻ thông tin cá nhân.

Hiện nay người dùng thường phải:

- gửi Facebook

- gửi Zalo

- gửi TikTok

- gửi Shopee

- gửi Website

- gửi Portfolio

- gửi số điện thoại

- gửi Email

bằng nhiều cách khác nhau.

Điều này gây mất thời gian.

Z-TOUCH gom tất cả thành một hồ sơ duy nhất.

---

## 1.3 Giá trị mang lại

Đối với người dùng

- Chia sẻ nhanh.

- Chuyên nghiệp.

- Không cần nhớ link.

- Không cần nhập số điện thoại.

- Không cần lưu nhiều QR.

---

Đối với doanh nghiệp

- Tiết kiệm chi phí in danh thiếp.

- Dễ cập nhật thông tin.

- Quản lý nhân viên.

- Quản lý NFC.

---

Đối với Creator

- Tăng Follow.

- Tăng Traffic.

- Tăng chuyển đổi.

- Chia sẻ Affiliate.

- Chia sẻ sản phẩm.

---

## 1.4 Mục tiêu của MVP

Phiên bản đầu tiên chỉ tập trung vào việc giúp người dùng:

Đăng ký

↓

Tạo hồ sơ

↓

Ghi NFC

↓

Chia sẻ hồ sơ

↓

Chỉnh sửa hồ sơ

Không phát triển thêm chức năng khác.

---

## 1.5 Triết lý sản phẩm

Sản phẩm phải:

Đơn giản.

Nhanh.

Đẹp.

Hiện đại.

An toàn.

Có thể mở rộng.

Mọi chức năng đều phải hướng đến trải nghiệm người dùng.

Không thêm tính năng chỉ vì đối thủ có.

---

## 1.6 Điểm khác biệt

Khác với Linktree

Z-TOUCH hỗ trợ NFC.

Khác với HiHello

Z-TOUCH hỗ trợ nhiều Profile.

Khác với danh thiếp

Z-TOUCH cập nhật theo thời gian thực.

Khác với QR thông thường

Một NFC có thể đổi Profile mà không cần ghi lại.

Đây là lợi thế cạnh tranh quan trọng nhất.

---

## 1.7 Định nghĩa Product

Sản phẩm gồm hai phần.

Phần mềm

+

Thiết bị NFC.

Hai phần này hoạt động cùng nhau.

Nếu thiếu một trong hai thì trải nghiệm sẽ không hoàn chỉnh.

---

## 1.8 Người dùng cuối

Người sử dụng cuối cùng không cần biết NFC hoạt động như thế nào.

Họ chỉ cần:

Đăng ký.

↓

Nhập thông tin.

↓

Chạm NFC.

↓

Hoàn thành.

Đây là tiêu chuẩn thiết kế của toàn bộ dự án.

---

## 1.9 Mục tiêu trải nghiệm

Một người chưa từng dùng NFC.

↓

Mua sản phẩm.

↓

Đăng ký.

↓

Tạo Profile.

↓

Sử dụng thành công.

↓

Tổng thời gian dưới 5 phút.

Nếu vượt quá 5 phút thì trải nghiệm cần được cải thiện.

---

## 1.10 Kết thúc chương

Chương này chỉ định nghĩa sản phẩm.

Không mô tả tính năng.

Không mô tả Database.

Không mô tả API.

Những nội dung đó sẽ nằm ở các chương sau.
# ============================================================
# CHƯƠNG 2
# PHẠM VI DỰ ÁN (PROJECT SCOPE)
# ============================================================

## 2.1 Mục đích

Chương này định nghĩa chính xác những gì Z-TOUCH sẽ phát triển và những gì sẽ không phát triển.

Đây là một trong những tài liệu quan trọng nhất của dự án.

Nếu không có phạm vi rõ ràng, dự án sẽ rất dễ gặp tình trạng "Feature Creep" (liên tục thêm chức năng mới khiến sản phẩm ngày càng phức tạp và không bao giờ hoàn thành).

Mỗi khi muốn thêm tính năng mới, AI hoặc lập trình viên phải quay lại đọc chương này trước.

---

## 2.2 Mục tiêu của MVP

Phiên bản đầu tiên (Minimum Viable Product) chỉ có một nhiệm vụ duy nhất:

Cho phép người dùng tạo hồ sơ số và chia sẻ hồ sơ đó thông qua NFC hoặc QR Code.

Đây là giá trị cốt lõi của toàn bộ dự án.

Nếu chưa làm tốt điều này thì tuyệt đối không mở rộng sang các tính năng khác.

---

## 2.3 Giá trị cốt lõi của MVP

MVP phải giải quyết được các câu hỏi sau:

Người dùng là ai?

↓

Người dùng có thể tạo hồ sơ không?

↓

Người dùng có thể sửa hồ sơ không?

↓

Người dùng có thể chia sẻ hồ sơ không?

↓

Người khác có thể xem hồ sơ không?

↓

NFC có hoạt động không?

↓

QR Code có hoạt động không?

Nếu câu trả lời của tất cả các câu hỏi trên đều là "Có" thì MVP đạt yêu cầu.

---

## 2.4 Những chức năng BẮT BUỘC phải có

### Authentication

- Đăng ký
- Đăng nhập
- Quên mật khẩu
- Đăng xuất
- Xác thực Email

---

### Dashboard

Người dùng phải có Dashboard riêng.

Dashboard là nơi quản lý toàn bộ tài khoản.

Dashboard không được hiển thị thông tin dư thừa.

Dashboard phải đơn giản.

---

### Profile

Mỗi người dùng có thể tạo nhiều Profile.

Ví dụ:

Profile Cá nhân

Profile Cứu hộ

Profile Doanh nghiệp

Profile Portfolio

Profile Thú cưng

Mỗi Profile có URL riêng.

---

### Public Page

Mỗi Profile sẽ có một trang Public.

Ví dụ

https://ztouch.vn/p/long

hoặc

https://ztouch.vn/p/abc123

Trang Public phải tối ưu cho điện thoại.

---

### NFC

Người dùng có thể liên kết Profile với NFC.

Nếu thay đổi Profile thì NFC vẫn giữ nguyên URL.

Chỉ dữ liệu hiển thị thay đổi.

Đây là điểm khác biệt lớn của Z-TOUCH.

---

### QR Code

Mỗi Profile phải có QR.

QR luôn đồng bộ với URL Public.

---

## 2.5 Những chức năng KHÔNG phát triển trong MVP

Để tránh làm sản phẩm quá lớn, các chức năng sau sẽ KHÔNG được phát triển trong phiên bản đầu tiên.

- Chat
- AI Chatbot
- Livestream
- Mạng xã hội
- Marketplace
- Forum
- Thanh toán định kỳ
- API công khai
- Mobile App
- Ví điện tử
- NFT
- Blockchain
- Crypto

Nếu AI đề xuất những tính năng này trong MVP thì phải từ chối.

---

## 2.6 Nguyên tắc mở rộng

Mỗi tính năng mới đều phải trả lời được 5 câu hỏi.

1.

Có giải quyết vấn đề của người dùng không?

2.

Có giúp tăng doanh thu không?

3.

Có làm sản phẩm đơn giản hơn không?

4.

Có làm hệ thống phức tạp hơn không?

5.

Có thật sự cần trong MVP không?

Nếu không vượt qua 5 câu hỏi trên thì không được phát triển.

---

## 2.7 Tiêu chí hoàn thành MVP

MVP chỉ được xem là hoàn thành khi:

✓ Người dùng đăng ký được.

✓ Người dùng đăng nhập được.

✓ Người dùng tạo Profile được.

✓ Người dùng chỉnh sửa Profile được.

✓ Người dùng chia sẻ Profile được.

✓ QR hoạt động.

✓ NFC hoạt động.

✓ Website chạy ổn định trên điện thoại.

✓ Website chạy ổn định trên máy tính.

✓ Không có lỗi nghiêm trọng.

---

## 2.8 Phạm vi kỹ thuật

Frontend:

Next.js

Backend:

Supabase

Database:

PostgreSQL

Authentication:

Supabase Auth

Storage:

Supabase Storage

Deploy:

Vercel

Ngôn ngữ:

TypeScript

UI:

TailwindCSS

Component:

shadcn/ui

---

## 2.9 Nguyên tắc phát triển

Không xây nhanh.

Xây đúng.

Không thêm nhiều tính năng.

Làm từng tính năng thật tốt.

Không tối ưu quá sớm.

Không thêm thư viện nếu chưa cần.

Ưu tiên code dễ đọc.

Ưu tiên tài liệu.

Ưu tiên khả năng bảo trì.

---

## 2.10 Kết thúc chương

Nếu một AI hoặc lập trình viên muốn thêm tính năng mới nhưng tính năng đó không nằm trong phạm vi của chương này thì phải:

1. Cập nhật PRODUCT.

2. Cập nhật ROADMAP.

3. Cập nhật DECISIONS.

4. Được người quản lý dự án phê duyệt.

Sau đó mới được viết code.

Kết thúc Chương 2.
