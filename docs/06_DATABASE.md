# ============================================================
# Z-TOUCH DATABASE DESIGN
# ============================================================

Version: 1.0.0

Status: Draft

Owner: Backend Team

Database:

PostgreSQL

Platform:

Supabase

Last Updated:

---

# MỤC ĐÍCH

Tài liệu này định nghĩa toàn bộ Database của Z-TOUCH.

Claude Code phải đọc tài liệu này trước khi tạo Migration hoặc viết SQL.

Không được tự ý tạo bảng nếu chưa có trong tài liệu.

---

# KIẾN TRÚC DATABASE

Z-TOUCH sử dụng PostgreSQL.

Supabase sẽ quản lý:

- Authentication

- Storage

- Database

- RLS

- Realtime

---

Database được thiết kế theo các nguyên tắc:

- Chuẩn hóa dữ liệu

- Không lưu dữ liệu trùng

- UUID làm Primary Key

- Soft Delete

- Audit Log

- Timestamp đầy đủ

---

# DANH SÁCH TABLE

01 users

02 profiles

03 profile_socials

04 emergency_contacts

05 nfc_cards

06 qr_codes

07 profile_views

08 audit_logs

---

# MỐI QUAN HỆ

User

↓

có nhiều

↓

Profiles

↓

Profile

↓

có nhiều

↓

Social Links

↓

Profile

↓

có nhiều

↓

Emergency Contacts

↓

Profile

↓

liên kết

↓

NFC Card

↓

NFC Card

↓

mở

↓

Public Profile
# CHƯƠNG 1

TABLE USERS
Tên bảng

users

Mô tả

Lưu thông tin tài khoản.

Primary Key

id

UUID

NOT NULL

--------------------------------

Các cột

id

uuid

PK

email

varchar

UNIQUE

password

Supabase Auth

username

varchar

UNIQUE

display_name

varchar

avatar_url

text

plan

free

premium

role

user

admin

super_admin

language

vi

theme

light

dark

created_at

timestamp

updated_at

timestamp

deleted_at

timestamp
---

# CHƯƠNG 2

# TABLE PROFILES

## Mục đích

Bảng Profiles lưu tất cả hồ sơ mà người dùng tạo.

Một tài khoản có thể có nhiều Profile.

Ví dụ:

- Hồ sơ cá nhân
- Hồ sơ cứu hộ
- Hồ sơ doanh nghiệp
- Portfolio
- Hồ sơ thú cưng
- Hồ sơ xe

Mỗi Profile có URL Public riêng.

---

## Tên bảng

profiles

---

## Primary Key

id

UUID

NOT NULL

---

## Foreign Key

user_id

→ users.id

---

## Các cột

id

uuid

PK

---

user_id

uuid

FK

---

slug

varchar

UNIQUE

Ví dụ

long

long-nguyen

abc123

---

profile_type

enum

Giá trị

personal

social

business

portfolio

rescue

pet

vehicle

student

---

title

varchar

Ví dụ

Bùi Hoàng Long

---

headline

varchar

Ví dụ

Automation Engineer

---

bio

text

Giới thiệu ngắn.

---

avatar_url

text

---

cover_url

text

---

website

text

---

email

varchar

---

phone

varchar

---

birthday

date

---

gender

enum

male

female

other

---

address

text

---

company

varchar

---

job_title

varchar

---

school

varchar

---

major

varchar

---

is_public

boolean

Mặc định

true

---

allow_search

boolean

Có cho tìm kiếm hay không.

---

allow_download_contact

boolean

Có cho tải vCard hay không.

---

theme

varchar

default

---

language

varchar

vi

---

view_count

integer

Mặc định

0

---

like_count

integer

0

---

share_count

integer

0

---

created_at

timestamp

---

updated_at

timestamp

---

deleted_at

timestamp

Soft Delete

---

## Quan hệ

Một User

↓

Có nhiều

↓

Profiles

---

Một Profile

↓

Có nhiều

↓

Social Links

---

Một Profile

↓

Có nhiều

↓

Emergency Contacts

---

Một Profile

↓

Có thể liên kết

↓

Một NFC

---

Một Profile

↓

Có nhiều lượt xem

↓

Analytics

---

## Index

INDEX

user_id

INDEX

slug

INDEX

profile_type

INDEX

is_public

---

## Quy tắc

Slug không được trùng.

Một Profile chỉ thuộc một User.

Profile có thể bị Soft Delete.

Không xóa cứng dữ liệu.

Nếu User bị xóa

↓

Profile chuyển trạng thái deleted.

---

## Ví dụ

id

a6c...

user_id

b9e...

slug

hoanglong

title

Bùi Hoàng Long

profile_type

personal

headline

Automation Student

bio

Xin chào 👋

Mình là sinh viên ngành Tự động hóa.

created_at

2026-07-06
---

# CHƯƠNG 3

# TABLE PROFILE_SOCIALS

## Mục đích

Bảng này lưu tất cả các liên kết mạng xã hội của từng Profile.

Không lưu trực tiếp các liên kết Facebook, TikTok, Shopee... trong bảng Profiles.

Lý do:

- Một Profile có thể có nhiều mạng xã hội.
- Có thể bổ sung mạng xã hội mới mà không cần sửa cấu trúc Database.
- Dễ bảo trì.
- Chuẩn hóa dữ liệu.

---

## Business Rules

Một Profile có thể có 0 hoặc nhiều Social Links.

Ví dụ:

Facebook

TikTok

Instagram

Shopee

YouTube

LinkedIn

Github

Website

Email

Phone

Telegram

Discord

Threads

X

Pinterest

Behance

Dribbble

Spotify

...

Không giới hạn số lượng.

Mỗi Social Link chỉ thuộc về một Profile.

---

## Tên bảng

profile_socials

---

## Primary Key

id

UUID

---

## Foreign Key

profile_id

↓

profiles.id

---

## Các cột

id

uuid

PK

---

profile_id

uuid

FK

---

platform

varchar

Ví dụ

facebook

tiktok

instagram

youtube

github

linkedin

website

email

phone

spotify

telegram

discord

...

---

url

text

Ví dụ

https://facebook.com/...

---

title

varchar

Ví dụ

Facebook cá nhân

TikTok Review

Shopee Store

---

icon

varchar

Ví dụ

facebook

tiktok

youtube

---

display_order

integer

Sắp xếp hiển thị.

1

2

3

4

...

---

is_visible

boolean

true

false

---

click_count

integer

Mặc định

0

---

created_at

timestamp

---

updated_at

timestamp

---

deleted_at

timestamp

Soft Delete

---

## Relationship

Một Profile

↓

Có nhiều

↓

Profile Socials

---

## Index

profile_id

platform

display_order

---

## Constraints

platform

NOT NULL

url

NOT NULL

---

## Ví dụ

profile_id

abc123

platform

facebook

url

https://facebook.com/hoanglong

title

Facebook cá nhân

display_order

1

is_visible

true

---

## Query thường dùng

Lấy toàn bộ Social Link của một Profile.

Sắp xếp theo display_order.

Chỉ lấy những bản ghi có is_visible = true.

---

## RLS

Người sở hữu Profile

↓

Được tạo.

↓

Được sửa.

↓

Được xóa.

Khách truy cập

↓

Chỉ được đọc những Social Link của Profile Public.

---

## Ghi chú

Tuyệt đối không tạo cột:

facebook_url

tiktok_url

youtube_url

instagram_url

...

trong bảng Profiles.

Tất cả phải lưu trong bảng profile_socials.

Đây là quy tắc bắt buộc.
---

# CHƯƠNG 4

# TABLE EMERGENCY_CONTACTS

## Mục đích

Bảng Emergency Contacts lưu toàn bộ thông tin cứu hộ của từng Profile.

Đây là tính năng quan trọng nhất của Z-TOUCH Rescue.

Khi người khác quét NFC hoặc QR trong trường hợp khẩn cấp, họ có thể xem thông tin cứu hộ để hỗ trợ người gặp nạn.

---

## Business Rules

Một Profile có thể có nhiều người liên hệ khẩn cấp.

Ví dụ:

- Cha
- Mẹ
- Vợ
- Chồng
- Anh
- Chị
- Em
- Bạn thân
- Đồng nghiệp

Người dùng có thể sắp xếp thứ tự ưu tiên liên hệ.

---

## Tên bảng

emergency_contacts

---

## Primary Key

id

UUID

---

## Foreign Key

profile_id

↓

profiles.id

---

## Các cột

id

uuid

PK

---

profile_id

uuid

FK

---

full_name

varchar(100)

Tên người liên hệ.

---

relationship

varchar(50)

Ví dụ

Cha

Mẹ

Anh trai

Bạn

...

---

phone

varchar(20)

---

phone_backup

varchar(20)

Không bắt buộc.

---

email

varchar(255)

Không bắt buộc.

---

priority

integer

1

2

3

...

---

is_primary

boolean

true

false

---

can_receive_sms

boolean

true

false

---

notes

text

Ví dụ

"Nếu không liên lạc được hãy gọi số thứ hai."

---

created_at

timestamp

---

updated_at

timestamp

---

deleted_at

timestamp

Soft Delete.

---

## Relationship

Một Profile

↓

Có nhiều

↓

Emergency Contacts

---

## Constraints

full_name

NOT NULL

phone

NOT NULL

priority

>= 1

---

## Index

profile_id

priority

is_primary

---

## Ví dụ dữ liệu

full_name

Nguyễn Văn A

relationship

Cha

phone

0901234567

priority

1

is_primary

true

---

## Query thường dùng

Lấy danh sách liên hệ khẩn cấp theo Profile.

Sắp xếp theo priority tăng dần.

---

## RLS

Chủ sở hữu Profile

↓

Được tạo

↓

Được sửa

↓

Được xóa

Khách truy cập

↓

Chỉ được xem nếu Profile đang Public.

---

## Ghi chú

Một Profile nên có ít nhất một Emergency Contact nếu thuộc loại Rescue Profile.
---

# CHƯƠNG 5

# TABLE NFC_CARDS

## Mục đích

Lưu thông tin tất cả thẻ NFC đã phát hành.

Mỗi thẻ NFC có UID riêng và có thể liên kết với một Profile.

Nếu người dùng đổi Profile, chỉ cần cập nhật liên kết trong Database, không cần ghi lại NFC.

---

## Business Rules

- Một User có thể sở hữu nhiều NFC.
- Một NFC chỉ liên kết với một Profile tại một thời điểm.
- NFC có thể đổi Profile bất kỳ lúc nào.

---

## Tên bảng

nfc_cards

---

## Primary Key

id

UUID

---

## Foreign Key

user_id → users.id

profile_id → profiles.id

---

## Các cột

id

uuid

PK

---

user_id

uuid

FK

---

profile_id

uuid

FK

---

nfc_uid

varchar(100)

UID vật lý của chip NFC.

---

serial_number

varchar(100)

Mã in trên sản phẩm.

---

status

enum

inactive

active

lost

locked

damaged

---

activated_at

timestamp

---

last_scan_at

timestamp

---

scan_count

integer

Mặc định 0

---

created_at

timestamp

---

updated_at

timestamp

---

deleted_at

timestamp

---

## Relationship

Một User

↓

Có nhiều

↓

NFC Cards

---

Một NFC

↓

Liên kết

↓

Một Profile

---

## Constraints

nfc_uid

UNIQUE

NOT NULL

---

serial_number

UNIQUE

---

## Index

user_id

profile_id

nfc_uid

status

---

## Ví dụ

serial_number

ZT-000001

status

active

scan_count

56

---

## Query thường dùng

Lấy NFC theo UID.

Kiểm tra NFC còn hoạt động.

Lấy Profile đang liên kết với NFC.

---

## RLS

Chỉ chủ sở hữu mới được thay đổi Profile liên kết.

Khách chỉ có quyền đọc Profile Public.

---

## Ghi chú

Tuyệt đối không lưu dữ liệu cá nhân trong chip NFC.

Chip chỉ lưu URL hoặc mã định danh an toàn.
---

# CHƯƠNG 6

# TABLE QR_CODES

## Mục đích

Lưu thông tin toàn bộ QR Code được tạo bởi hệ thống.

Mỗi Profile có ít nhất một QR Code.

QR Code luôn trỏ tới URL Public của Profile.

QR không lưu dữ liệu người dùng.

QR chỉ chứa URL hoặc mã định danh.

---

## Business Rules

Một Profile có thể có nhiều QR.

Ví dụ:

QR mặc định

QR doanh nghiệp

QR sự kiện

QR chiến dịch Marketing

QR giới hạn thời gian

QR Premium

---

## Tên bảng

qr_codes

---

## Primary Key

id

UUID

---

## Foreign Key

profile_id

↓

profiles.id

---

## Các cột

id

uuid

PK

---

profile_id

uuid

FK

---

qr_token

varchar(120)

UNIQUE

---

qr_url

text

---

type

enum

default

campaign

premium

temporary

---

is_active

boolean

true

false

---

expire_at

timestamp

nullable

---

scan_count

integer

default 0

---

last_scan_at

timestamp

nullable

---

created_at

timestamp

---

updated_at

timestamp

---

deleted_at

timestamp

---

## Relationship

Profile

↓

Có nhiều

↓

QR Codes

---

## Constraints

qr_token

UNIQUE

NOT NULL

---

profile_id

NOT NULL

---

## Index

profile_id

qr_token

is_active

expire_at

---

## Ví dụ

profile_id

abc123

qr_token

zt_93jsk82k2

qr_url

https://ztouch.vn/p/hoanglong

type

default

scan_count

230

---

## Query thường dùng

Lấy QR theo Profile.

Kiểm tra QR còn hoạt động.

Tăng scan_count.

---

## RLS

Chủ sở hữu được tạo.

Được xóa.

Được cập nhật.

Khách chỉ được đọc QR đang active.

---

## Ghi chú

QR luôn đồng bộ với Profile.

Không tạo QR lưu dữ liệu cá nhân.
---

# CHƯƠNG 7

# TABLE PROFILE_VIEWS

## Mục đích

Lưu toàn bộ lượt xem Profile.

Dữ liệu này phục vụ thống kê.

Không phục vụ xác thực.

---

## Business Rules

Mỗi lần mở Public Profile

↓

Tạo một bản ghi.

Không cập nhật bản ghi cũ.

---

## Tên bảng

profile_views

---

## Primary Key

id

UUID

---

## Foreign Key

profile_id

↓

profiles.id

---

## Các cột

id

uuid

PK

---

profile_id

uuid

FK

---

visitor_ip

varchar

nullable

---

country

varchar

---

city

varchar

---

device

varchar

mobile

desktop

tablet

---

browser

varchar

Chrome

Safari

Edge

Firefox

...

---

os

varchar

Android

iOS

Windows

MacOS

Linux

---

referrer

text

---

user_agent

text

---

is_nfc

boolean

---

is_qr

boolean

---

viewed_at

timestamp

---

## Relationship

Profile

↓

Có nhiều

↓

Views

---

## Index

profile_id

viewed_at

country

device

---

## Ví dụ

profile_id

abc123

country

Vietnam

device

mobile

browser

Chrome

is_nfc

true

viewed_at

2026-07-06

---

## Query thường dùng

Đếm lượt xem.

Thống kê theo ngày.

Thống kê theo quốc gia.

Thống kê theo thiết bị.

---

## RLS

Chỉ chủ Profile được xem Analytics.

Khách không có quyền đọc.

---

## Ghi chú

Không lưu thông tin nhạy cảm.

Tuân thủ quyền riêng tư.
---

# CHƯƠNG 8

# TABLE AUDIT_LOGS

## Mục đích

Theo dõi toàn bộ thay đổi quan trọng của hệ thống.

Ví dụ:

Đăng nhập

Đổi Profile

Đổi NFC

Xóa Profile

Đổi Email

...

---

## Tên bảng

audit_logs

---

## Các cột

id

uuid

PK

---

user_id

uuid

FK

---

action

varchar

---

entity

varchar

profile

nfc

user

...

---

entity_id

uuid

---

description

text

---

ip

varchar

---

device

varchar

---

created_at

timestamp

---

## Index

user_id

action

created_at

---

## Ghi chú

Không được sửa dữ liệu trong Audit Log.

Chỉ thêm mới.

