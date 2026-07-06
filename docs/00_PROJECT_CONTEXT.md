# Z-TOUCH PROJECT CONTEXT

**Version:** 1.0.0

**Status:** Draft

**Project Name:** Z-TOUCH

**Product Type:** SaaS Platform + NFC Ecosystem

**Founder:** Bùi Hoàng Long

**Primary Language:** Tiếng Việt

**Repository:** ztouch

**Created:** 2026

---

# TÀI LIỆU QUAN TRỌNG NHẤT CỦA DỰ ÁN

Đây là tài liệu gốc của toàn bộ dự án Z-TOUCH.

Mọi quyết định về sản phẩm, thiết kế, lập trình, cơ sở dữ liệu, giao diện, bảo mật và triển khai đều phải tuân theo tài liệu này.

Tài liệu này là nguồn sự thật duy nhất (Single Source of Truth).

Nếu có sự khác nhau giữa code và tài liệu thì tài liệu được xem là đúng cho đến khi có quyết định cập nhật chính thức.

---

# QUY ĐỊNH DÀNH CHO AI

Mọi AI tham gia dự án gồm:

- Claude Code
- ChatGPT
- Gemini
- Cursor AI
- GitHub Copilot
- Các AI khác

đều phải tuân thủ các nguyên tắc sau:

1. Luôn đọc PROJECT_CONTEXT trước khi thực hiện bất kỳ công việc nào.

2. Không tự ý thay đổi định hướng sản phẩm.

3. Không tự ý thay đổi công nghệ.

4. Không tự ý đổi Database.

5. Không tự ý đổi Framework.

6. Không tự ý xóa chức năng.

7. Không tự ý đổi giao diện nếu chưa được yêu cầu.

8. Không được viết code khi chưa hiểu yêu cầu.

9. Nếu phát hiện mâu thuẫn giữa các tài liệu phải dừng và báo lại.

10. Mọi thay đổi lớn đều phải cập nhật tài liệu.

---

# GIỚI THIỆU DỰ ÁN

## Z-TOUCH là gì?

Z-TOUCH là nền tảng hồ sơ số thông minh hoạt động thông qua NFC và QR Code.

Người dùng sở hữu một tài khoản Z-TOUCH.

Trong tài khoản đó họ có thể tạo nhiều hồ sơ khác nhau.

Ví dụ:

- Hồ sơ cá nhân
- Hồ sơ cứu hộ
- Danh thiếp điện tử
- Portfolio
- Hồ sơ thú cưng
- Hồ sơ xe
- Hồ sơ doanh nghiệp

Mỗi hồ sơ có một đường dẫn riêng.

Người dùng có thể chọn hồ sơ nào sẽ được liên kết với chiếc móc khóa NFC hoặc mã QR.

---

## Mục tiêu của sản phẩm

Z-TOUCH không phải là website bán móc khóa.

Móc khóa chỉ là phương tiện.

Giá trị cốt lõi nằm ở nền tảng quản lý hồ sơ số.

Trong tương lai người dùng có thể sử dụng:

- Móc khóa NFC
- Thẻ NFC
- Sticker NFC
- QR Code
- Apple Wallet
- Google Wallet

để chia sẻ thông tin.

---

## Tại sao dự án này tồn tại?

Ngày nay việc chia sẻ thông tin cá nhân còn bất tiện.

Ví dụ:

Muốn chia sẻ Facebook.

↓

Phải mở Facebook.

↓

Tìm tài khoản.

↓

Đưa điện thoại.

↓

Kết bạn.

Hoặc

Muốn chia sẻ số điện thoại.

↓

Phải đọc số.

↓

Người khác nhập.

↓

Có thể nhập sai.

Hoặc

Muốn gửi Portfolio.

↓

Mở Drive.

↓

Copy Link.

↓

Gửi Messenger.

↓

Người nhận mới xem.

Những thao tác này mất thời gian.

Z-TOUCH giải quyết vấn đề đó.

Người dùng chỉ cần:

Một chạm NFC.

Hoặc

Một lần quét QR.

Mọi thông tin sẽ xuất hiện ngay.

---

# TẦM NHÌN

Z-TOUCH hướng tới việc trở thành nền tảng hồ sơ số phổ biến nhất tại Việt Nam.

Trong tương lai, mỗi người đều có một hồ sơ số duy nhất.

Thay vì mang nhiều danh thiếp, nhiều tài khoản hay nhiều giấy tờ, người dùng chỉ cần mang theo một thiết bị NFC.

Mục tiêu dài hạn là xây dựng một hệ sinh thái cho phép quản lý và chia sẻ thông tin một cách an toàn, nhanh chóng và thuận tiện.

---

# SỨ MỆNH

Sứ mệnh của Z-TOUCH là giúp mọi người chia sẻ thông tin chỉ bằng một chạm.

Sản phẩm phải đơn giản để bất kỳ ai cũng có thể sử dụng, kể cả người không am hiểu công nghệ.

Mỗi tính năng được phát triển phải trả lời được câu hỏi:

"Tính năng này có giúp người dùng chia sẻ thông tin nhanh hơn, an toàn hơn hoặc tiện lợi hơn không?"

Nếu câu trả lời là không, tính năng đó không nên được ưu tiên.

---

# GIÁ TRỊ CỐT LÕI

## 1. Đơn giản

Người dùng mới phải có thể tạo hồ sơ đầu tiên trong vòng dưới 5 phút.

## 2. Nhanh

Từ lúc chạm NFC đến khi hiển thị thông tin không nên mất quá vài giây trong điều kiện mạng bình thường.

## 3. An toàn

Người dùng phải kiểm soát được thông tin nào được công khai và thông tin nào chỉ dành cho bản thân hoặc người được phép xem.

## 4. Linh hoạt

Một tài khoản có thể chứa nhiều hồ sơ khác nhau và có thể chuyển đổi hồ sơ đang được liên kết với NFC.

## 5. Khả năng mở rộng

Kiến trúc hệ thống phải cho phép bổ sung loại hồ sơ mới mà không cần viết lại toàn bộ ứng dụng.

---

# PHẠM VI GIAI ĐOẠN MVP

Phiên bản đầu tiên chỉ tập trung vào việc giải quyết bài toán cốt lõi.

MVP sẽ bao gồm:

- Đăng ký tài khoản
- Đăng nhập
- Quản lý hồ sơ
- Hồ sơ cá nhân
- Hồ sơ cứu hộ
- Hồ sơ mạng xã hội
- Tạo đường dẫn chia sẻ
- Sinh QR Code
- Liên kết NFC
- Trang hồ sơ công khai

Những tính năng như thanh toán, AI, thống kê nâng cao, doanh nghiệp, ứng dụng di động sẽ được phát triển sau khi MVP ổn định.

---

# TRIẾT LÝ PHÁT TRIỂN

Z-TOUCH không chạy theo số lượng tính năng.

Ưu tiên của dự án là tạo ra trải nghiệm tốt nhất.

Mỗi tính năng mới phải đáp ứng ba điều kiện:

1. Giải quyết một nhu cầu thực tế.
2. Dễ sử dụng với người mới.
3. Không làm hệ thống phức tạp hơn một cách không cần thiết.

Chúng ta ưu tiên chất lượng hơn tốc độ phát triển.
# TRIẾT LÝ SẢN PHẨM (PRODUCT PHILOSOPHY)

Z-TOUCH không phải là một website để lưu liên kết.

Z-TOUCH là một nền tảng định danh số (Digital Identity Platform) cho phép người dùng quản lý và chia sẻ thông tin của mình một cách chủ động, nhanh chóng và an toàn thông qua NFC và QR Code.

Sản phẩm phải được xây dựng theo triết lý "User First".

Mọi quyết định về thiết kế, lập trình, giao diện hay tính năng đều phải ưu tiên lợi ích của người dùng cuối.

Nếu một tính năng khiến người dùng phải suy nghĩ quá nhiều hoặc cần đọc hướng dẫn mới sử dụng được thì tính năng đó cần được thiết kế lại.

---

## Những điều KHÔNG làm

Dự án tuyệt đối không phát triển theo các hướng sau:

- Không trở thành mạng xã hội.
- Không thu thập dữ liệu người dùng ngoài mục đích vận hành.
- Không bán dữ liệu người dùng.
- Không hiển thị quảng cáo.
- Không ép người dùng nâng cấp Premium để sử dụng các chức năng cơ bản.
- Không tạo giao diện phức tạp.
- Không sử dụng hiệu ứng gây rối mắt.
- Không tạo trải nghiệm giống các website cũ kỹ.

---

## Những điều LUÔN làm

- Thiết kế tối giản.
- Tốc độ tải nhanh.
- Responsive trên mọi thiết bị.
- Mobile First.
- Bảo vệ quyền riêng tư.
- Giao diện nhất quán.
- Dễ mở rộng.
- Dễ bảo trì.
- Dễ phát triển thêm tính năng.

---

# ĐỐI TƯỢNG KHÁCH HÀNG (CUSTOMER PERSONAS)

Z-TOUCH không hướng tới tất cả mọi người.

Trong giai đoạn MVP, dự án chỉ tập trung vào những nhóm khách hàng có nhu cầu rõ ràng và sẵn sàng sử dụng NFC.

---

# Persona 01 – Sinh viên công nghệ

Tên giả định:

Long

Tuổi:

20

Giới tính:

Nam

Nghề nghiệp:

Sinh viên ngành Kỹ thuật hoặc CNTT.

Thu nhập:

2 đến 5 triệu đồng/tháng.

Thiết bị sử dụng:

- Điện thoại Android.
- Laptop Windows.

Ứng dụng sử dụng hằng ngày:

- Facebook.
- TikTok.
- Messenger.
- Shopee.
- Gmail.
- ChatGPT.

Mục tiêu:

Muốn chia sẻ Facebook, GitHub, Portfolio và thông tin cá nhân nhanh chóng.

Nỗi đau:

- Phải gửi nhiều link.
- Portfolio khó chia sẻ.
- Không có danh thiếp.
- Muốn tạo hình ảnh chuyên nghiệp.

Giải pháp của Z-TOUCH:

Một chiếc móc khóa NFC có thể mở ngay hồ sơ cá nhân.

---

# Persona 02 – Creator

Độ tuổi:

18–35.

Nghề nghiệp:

TikToker, YouTuber, Streamer, KOC, Freelancer.

Mục tiêu:

- Tăng người theo dõi.
- Chia sẻ tất cả mạng xã hội.
- Chia sẻ link affiliate.
- Chia sẻ sản phẩm Shopee.

Nỗi đau:

Hiện tại phải dùng Linktree hoặc gửi nhiều đường link khác nhau.

Giải pháp:

Một trang hồ sơ đẹp, cá nhân hóa và mở bằng NFC hoặc QR.

---

# Persona 03 – Nhân viên văn phòng

Độ tuổi:

23–40.

Nghề nghiệp:

Kinh doanh, Marketing, IT, Quản lý.

Mục tiêu:

Thay thế danh thiếp giấy.

Muốn chia sẻ:

- Email.
- Số điện thoại.
- Website.
- LinkedIn.
- Địa chỉ công ty.

Nỗi đau:

Danh thiếp giấy dễ mất.

Khó cập nhật thông tin.

Giải pháp:

Danh thiếp điện tử luôn cập nhật theo thời gian thực.

---

# Persona 04 – Người thích du lịch

Đặc điểm:

- Leo núi.
- Phượt.
- Camping.
- Chạy bộ.
- Đạp xe.

Nhu cầu:

Nếu xảy ra tai nạn thì người khác có thể biết:

- Nhóm máu.
- Dị ứng.
- Người thân.
- Thuốc đang sử dụng.

Giải pháp:

Rescue Profile.

---

# Persona 05 – Chủ doanh nghiệp nhỏ

Đặc điểm:

- Có cửa hàng.
- Có quán cà phê.
- Có showroom.
- Có studio.

Nhu cầu:

Chia sẻ:

- Fanpage.
- Google Maps.
- Menu.
- Website.
- Hotline.

---

# USER JOURNEY

## Hành trình của người dùng

Bước 1

Người dùng xem video TikTok.

↓

Bước 2

Quan tâm đến móc khóa NFC.

↓

Bước 3

Đặt mua trên Shopee.

↓

Bước 4

Nhận sản phẩm.

↓

Bước 5

Quét QR hướng dẫn.

↓

Bước 6

Đăng ký tài khoản.

↓

Bước 7

Tạo Profile đầu tiên.

↓

Bước 8

Ghi dữ liệu vào NFC.

↓

Bước 9

Mang theo sử dụng.

↓

Bước 10

Bạn bè chạm NFC.

↓

Bước 11

Thông tin hiển thị.

↓

Bước 12

Người dùng quay lại chỉnh sửa Profile khi cần.

---

# MÔ HÌNH KINH DOANH

Nguồn doanh thu giai đoạn đầu:

1. Bán móc khóa NFC.

2. Bán thẻ NFC.

3. Bán sticker NFC.

4. Dịch vụ in theo yêu cầu.

5. Gói Premium.

Trong tương lai có thể mở rộng:

- Gói doanh nghiệp.
- API trả phí.
- White Label.
- Hệ thống đại lý.

---

# TIÊU CHÍ THÀNH CÔNG

MVP được xem là thành công khi đạt:

- 100 người dùng đăng ký.
- 50 người dùng hoạt động.
- 100 đơn hàng NFC.
- 80% người dùng tạo ít nhất một Profile.
- Tỷ lệ quay lại sau 30 ngày trên 30%.

---

# NGUYÊN TẮC THIẾT KẾ

Mọi giao diện phải tuân thủ:

- Đơn giản.
- Dễ hiểu.
- Ít bước thao tác.
- Không cần đọc hướng dẫn.
- Có thể dùng bằng một tay trên điện thoại.
- Responsive.
- Hỗ trợ Dark Mode trong tương lai.

---

# NGUYÊN TẮC PHÁT TRIỂN AI

Claude Code và các AI khác phải luôn ghi nhớ:

- Không tự ý thêm tính năng ngoài phạm vi.
- Không viết code nếu chưa hiểu yêu cầu.
- Nếu có nhiều cách triển khai, ưu tiên cách đơn giản và dễ bảo trì.
- Mọi quyết định ảnh hưởng đến kiến trúc phải được ghi lại trong `13_DECISIONS.md`.
- Sau mỗi tính năng hoàn thành phải cập nhật CHANGELOG và tài liệu liên quan.
# NGUYÊN TẮC PHÁT TRIỂN DỰ ÁN

## Mục tiêu của tài liệu này

PROJECT_CONTEXT.md không phải là tài liệu mô tả sản phẩm thông thường.

Đây là bộ nhớ dài hạn (Long-term Memory) của dự án.

Mọi AI tham gia phát triển dự án đều phải xem đây là nguồn thông tin chính xác nhất.

Nếu trong cuộc trò chuyện xuất hiện thông tin mâu thuẫn với tài liệu này thì AI phải ưu tiên tài liệu.

Nếu tài liệu đã lỗi thời thì AI phải đề xuất cập nhật tài liệu trước khi sửa code.

---

# PHẠM VI TRÁCH NHIỆM

PROJECT_CONTEXT.md chịu trách nhiệm định nghĩa:

- Mục tiêu dự án
- Triết lý phát triển
- Đối tượng khách hàng
- Kiến trúc tổng thể
- Quy tắc phát triển
- Quy trình làm việc
- Tiêu chuẩn chất lượng
- Mục tiêu kinh doanh
- Định hướng lâu dài

PROJECT_CONTEXT.md không định nghĩa:

- Database chi tiết
- API chi tiết
- UI chi tiết
- Source Code

Những phần đó được lưu ở các tài liệu khác.

---

# CẤU TRÚC TÀI LIỆU

Toàn bộ tài liệu của dự án được chia thành nhiều phần.

00_PROJECT_CONTEXT.md

↓

01_VISION.md

↓

02_PRODUCT.md

↓

03_FEATURES.md

↓

04_ROADMAP.md

↓

05_RULES.md

↓

06_DATABASE.md

↓

07_API.md

↓

08_UI.md

↓

09_BUSINESS.md

↓

10_SECURITY.md

↓

11_DEPLOY.md

↓

12_CHANGELOG.md

↓

13_DECISIONS.md

↓

14_PROMPTS.md

↓

15_AGENT_GUIDE.md

Mỗi tài liệu có trách nhiệm riêng.

Không được ghi nội dung trùng lặp.

---

# QUY TRÌNH LÀM VIỆC CỦA AI

Mỗi khi bắt đầu một phiên làm việc, AI phải thực hiện đúng quy trình sau.

Bước 1

Đọc PROJECT_CONTEXT.md.

↓

Bước 2

Đọc RULES.md.

↓

Bước 3

Đọc DATABASE.md.

↓

Bước 4

Đọc UI.md.

↓

Bước 5

Đọc CHANGELOG.md.

↓

Bước 6

Tóm tắt lại những gì đã hiểu.

↓

Bước 7

Chỉ khi đã hiểu đầy đủ mới được phép viết code.

Nếu còn bất kỳ điểm nào chưa rõ thì AI phải hỏi lại.

Không được tự suy đoán.

---

# QUY TRÌNH PHÁT TRIỂN

Mọi tính năng đều phải trải qua các bước sau.

1.

Phân tích yêu cầu.

2.

Đọc tài liệu liên quan.

3.

Đề xuất giải pháp.

4.

Đánh giá ảnh hưởng.

5.

Viết code.

6.

Tự kiểm tra.

7.

Sửa lỗi.

8.

Cập nhật tài liệu.

9.

Commit.

10.

Hoàn thành.

Không được bỏ qua bất kỳ bước nào.

---

# ĐỊNH NGHĨA "HOÀN THÀNH"

Một tính năng chỉ được xem là hoàn thành khi đáp ứng tất cả điều kiện sau.

✓ Code hoạt động.

✓ Không có lỗi biên dịch.

✓ Không có lỗi TypeScript.

✓ Không có lỗi ESLint.

✓ Responsive.

✓ Đã cập nhật tài liệu.

✓ Đã cập nhật CHANGELOG.

✓ Không làm hỏng chức năng cũ.

✓ Có thể triển khai.

Nếu thiếu một điều kiện thì tính năng chưa hoàn thành.

---

# NGUYÊN TẮC QUẢN LÝ SOURCE CODE

Mọi source code phải dễ đọc.

Không viết code chỉ để chạy được.

Ưu tiên:

- Đơn giản.
- Dễ hiểu.
- Dễ mở rộng.
- Dễ bảo trì.

Không tối ưu quá sớm.

Không viết code phức tạp khi chưa cần.

---

# QUY TẮC COMMIT

Mỗi commit chỉ nên giải quyết một vấn đề.

Ví dụ:

Đúng

feat(auth): thêm đăng nhập Google

fix(profile): sửa lỗi cập nhật avatar

docs(project): cập nhật PROJECT_CONTEXT

Sai

Update

Fix

123

abc

Commit message phải thể hiện rõ nội dung thay đổi.

---

# QUY TẮC REVIEW

Trước khi kết thúc một phiên làm việc, AI phải tự kiểm tra.

Danh sách kiểm tra:

□ Đã đọc tài liệu chưa?

□ Có thay đổi kiến trúc không?

□ Có cần cập nhật DECISIONS.md không?

□ Có cần cập nhật CHANGELOG.md không?

□ Có phá vỡ tính năng cũ không?

□ Có phát sinh nợ kỹ thuật không?

□ Có cách nào đơn giản hơn không?

Nếu còn bất kỳ câu trả lời nào chưa rõ thì chưa được kết thúc.

---

# MỤC TIÊU PHIÊN BẢN MVP

Phiên bản đầu tiên không hướng tới việc có nhiều tính năng.

Mục tiêu là tạo ra trải nghiệm hoàn chỉnh.

MVP phải cho phép:

- Đăng ký.
- Đăng nhập.
- Tạo hồ sơ.
- Chỉnh sửa hồ sơ.
- Chia sẻ hồ sơ.
- Quản lý NFC.
- Quản lý QR Code.

Nếu những chức năng này hoạt động ổn định thì MVP được xem là thành công.

---

# ĐỊNH HƯỚNG TƯƠNG LAI

Sau khi MVP hoàn thành, dự án sẽ phát triển theo các giai đoạn.

Giai đoạn 2

- Premium.
- Analytics.
- Theme.
- QR nâng cao.

Giai đoạn 3

- Business.
- Team.
- API.
- White Label.

Giai đoạn 4

- Android.
- iOS.
- Đồng bộ đa thiết bị.

Giai đoạn 5

- AI Assistant.
- AI Profile Builder.
- AI Content Generator.

Tất cả các quyết định mở rộng đều phải đảm bảo không phá vỡ kiến trúc hiện tại.

---

# KẾT LUẬN

PROJECT_CONTEXT.md là nền tảng của toàn bộ dự án.

Mỗi AI, mỗi lập trình viên và mỗi thành viên tham gia dự án đều phải hiểu và tuân thủ tài liệu này.

Nếu có mâu thuẫn giữa ý tưởng mới và tài liệu hiện tại thì phải cập nhật tài liệu trước.

Không được để source code đi trước tài liệu.

Tài liệu luôn là kim chỉ nam cho mọi quyết định trong dự án.

Kết thúc Chương 1.
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
