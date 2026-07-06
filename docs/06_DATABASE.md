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

