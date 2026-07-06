# ============================================================
# Z-TOUCH DEVELOPMENT RULES
# ============================================================

Version: 1.0.0

Status: Official

Owner: CTO

---

# MỤC TIÊU

Tài liệu này định nghĩa toàn bộ quy tắc phát triển của dự án.

Mọi AI và lập trình viên đều phải tuân thủ.

Nếu source code khác với tài liệu này thì tài liệu được ưu tiên.

---

# QUY TẮC CHUNG

Ưu tiên:

Đơn giản

↓

Dễ đọc

↓

Dễ mở rộng

↓

Hiệu năng

Không tối ưu quá sớm.

Không viết code thông minh.

Viết code dễ hiểu.

---

# TECH STACK

Next.js 15

TypeScript

TailwindCSS

Supabase

PostgreSQL

shadcn/ui

Lucide React

Zod

React Hook Form

---

# KIẾN TRÚC

Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

Không viết toàn bộ logic trong Component.

---

# FOLDER

apps/web

components

features

lib

hooks

types

services

utils

styles

public
---

# CHƯƠNG 1

# NAMING CONVENTION

Folder

kebab-case

Ví dụ

profile-editor

---------------------

Component

PascalCase

ProfileCard.tsx

---------------------

Hook

useProfile.ts

---------------------

Function

camelCase

---------------------

Variable

camelCase

---------------------

Constant

UPPER_CASE

---------------------

Type

PascalCase

---------------------

Interface

PascalCase

Ví dụ

Profile

User

DashboardStats

---------------------

Enum

PascalCase
---

# CHƯƠNG 2

# TYPESCRIPT

Không dùng any.

Ưu tiên type.

Interface dùng cho Object.

Strict Mode luôn bật.

Không dùng @ts-ignore.

Không ép kiểu nếu không cần.

Function phải có kiểu trả về.

Export rõ ràng.

Không dùng Default Export.

Luôn dùng Named Export.
---

# CHƯƠNG 3

# REACT

Một Component chỉ làm một việc.

Không vượt quá 250 dòng.

Hook riêng.

Logic riêng.

UI riêng.

Không Fetch trong Component nếu có thể.

Server Component mặc định.
---

# CHƯƠNG 4

# TAILWIND

Không viết CSS nếu Tailwind làm được.

Không dùng Inline Style.

Class dài

↓

Tách Component.

Responsive trước.

Dark Mode hỗ trợ.

Spacing theo 4px.
---

# CHƯƠNG 5

# GIT

Commit nhỏ.

Commit rõ ràng.

Không commit code lỗi.

Commit Message

feat:

fix:

docs:

refactor:

style:

test:

chore:
---

# CHƯƠNG 6

# SECURITY

Không lưu Password.

Không lưu Token.

Không Trust Client.

Validate Server.

RLS luôn bật.

Escape Input.

Rate Limit.

Audit Log.
---

# CHƯƠNG 7

# AI RULES

Claude Code phải đọc:

00_PROJECT_CONTEXT.md

↓

02_PRODUCT.md

↓

06_DATABASE.md

↓

08_UI.md

↓

05_RULES.md

Sau đó mới được code.

Nếu thiếu thông tin

↓

Hỏi lại.

Không tự đoán.

