# EmailJS Setup Guide

Hướng dẫn thiết lập EmailJS để gửi email từ trang Contact form.

## Bước 1: Tạo tài khoản EmailJS

1. Truy cập https://www.emailjs.com/
2. Đăng ký tài khoản miễn phí (200 emails/tháng)
3. Đăng nhập vào dashboard

## Bước 2: Tạo Email Service

1. Vào **Email Services** trong dashboard
2. Click **Add New Service** (hoặc click icon **pencil/edit** nếu đã có service)
3. Chọn email provider (Gmail, Outlook, hoặc Custom SMTP)
4. Kết nối với email của bạn
5. **QUAN TRỌNG - CẤU HÌNH RECIPIENT EMAIL:**
   - Trong form cấu hình service, tìm phần **"Service Settings"** hoặc **"Email Settings"**
   - Tìm trường có tên một trong các tên sau:
     - **"To Email"**
     - **"Recipient Email"** 
     - **"Send To"**
     - **"Recipient"**
   - Điền email của bạn vào trường này (ví dụ: `phamtuan301104@gmail.com`)
   - **Đây là email sẽ NHẬN các message từ contact form**
   - ⚠️ **BẮT BUỘC:** Nếu không có email này sẽ báo lỗi "The recipients address is empty"
6. Click **Save** hoặc **Update** để lưu
7. Lưu lại **Service ID** (ví dụ: `service_30llqr6`) - hiển thị ngay dưới tên service

## Bước 3: Tạo Email Templates

Bạn cần tạo **2 templates**: một cho admin và một cho người gửi.

### Template 1: Admin Email (Nhận thông tin từ form)

1. Vào **Email Templates** trong dashboard
2. Click **Create New Template**
3. **Mở file `EMAILJS_TEMPLATE.md`** trong thư mục project
4. Copy **Template 1 - Subject Line** và paste vào ô "Subject"
5. Copy **Template 1 - Content** và paste vào ô "Content"
6. Chọn format: **HTML**
7. Trong phần **Settings**, tìm trường **"To Email"** và điền: `phamtuan301104@gmail.com` (hoặc dùng `{{to_email}}`)
8. Lưu template và lưu lại **Template ID** (ví dụ: `template_admin_xxxxxxx`)

### Template 2: Confirmation Email (Gửi cho người gửi form)

1. Click **Create New Template** lần nữa
2. Copy **Template 2 - Subject Line** từ `EMAILJS_TEMPLATE.md`
3. Copy **Template 2 - Content** từ `EMAILJS_TEMPLATE.md`
4. Chọn format: **HTML**
5. Trong phần **Settings**, tìm trường **"To Email"** và điền: `{{email}}` (sẽ được thay bằng email người gửi)
   - ⚠️ **Lưu ý:** Dùng `{{email}}` (không phải `{{to_email}}`) vì code gửi parameter `email`
6. Lưu template và lưu lại **Template ID** (ví dụ: `template_confirmation_xxxxxxx`)

## Bước 4: Lấy Public Key

1. Vào **Account** > **General** trong dashboard
2. Tìm **Public Key** (ví dụ: `xxxxxxxxxxxxx`)
3. Copy public key

## Bước 5: Cấu hình Environment Variables

1. Tạo file `.env` trong thư mục `FE_CookingRecipe`
2. Điền các giá trị:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_admin_xxxxxxx
VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID=template_confirmation_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
VITE_CONTACT_EMAIL=phamtuan301104@gmail.com
```

3. Thay thế các giá trị bằng thông tin thực tế của bạn:
   - `VITE_EMAILJS_TEMPLATE_ID`: Template ID của admin email
   - `VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID`: Template ID của confirmation email (optional - nếu không có thì chỉ gửi admin email)
   - `VITE_CONTACT_EMAIL`: Email admin sẽ nhận message (phamtuan301104@gmail.com)

## Bước 6: Cài đặt Dependencies

```bash
npm install
```

## Bước 7: Test

1. Chạy development server:
```bash
npm run dev
```

2. Truy cập trang Contact và thử gửi một message
3. Kiểm tra email của bạn để xem message đã được gửi chưa

## Lưu ý

- File `.env` đã được thêm vào `.gitignore` để bảo mật
- Không commit file `.env` lên Git
- Với tài khoản miễn phí, bạn có 200 emails/tháng
- Nếu cần nhiều hơn, có thể nâng cấp lên gói trả phí

## Troubleshooting

**Lỗi "Email service is not configured":**
- Kiểm tra file `.env` đã được tạo chưa
- Đảm bảo các biến môi trường bắt đầu với `VITE_`
- Restart development server sau khi thêm/sửa `.env`

**Lỗi 422 - "The recipients address is empty":**
- **Nguyên nhân:** Email Service chưa được cấu hình với địa chỉ email người nhận
- **Giải pháp cho Gmail Service:**
  
  **Cách 1: Cấu hình trong Template (Khuyến nghị)**
  1. Code đã được cập nhật để gửi `to_email` trong template parameters
  2. Vào EmailJS Dashboard > **Email Templates**
  3. Mở template của bạn
  4. Trong phần **Settings** hoặc **Advanced Settings**, tìm trường **"To Email"** hoặc **"Recipient"**
  5. Điền email của bạn (ví dụ: `phamtuan301104@gmail.com`) HOẶC dùng biến `{{to_email}}`
  6. Nếu dùng biến `{{to_email}}`, đảm bảo code đã gửi parameter này (đã được cập nhật)
  7. Click **Save**
  
  **Cách 2: Cấu hình trong Service Settings**
  1. Vào EmailJS Dashboard > **Email Services**
  2. Click vào icon **pencil/edit** (✏️) ở service của bạn
  3. Scroll xuống tìm phần **"Advanced Settings"** hoặc **"Email Settings"**
  4. Tìm trường **"To Email"**, **"Recipient Email"**, hoặc **"Default Recipient"**
  5. Điền email của bạn (ví dụ: `phamtuan301104@gmail.com`)
  6. Click **Update Service** để lưu
  
  **Cách 3: Dùng biến trong Template (Đã được cập nhật trong code)**
  - Code đã gửi `to_email` trong template parameters
  - Đảm bảo file `.env` có `VITE_CONTACT_EMAIL=phamtuan301104@gmail.com`
  - Hoặc code sẽ dùng default: `phamtuan301104@gmail.com`

**Lỗi 422 - Invalid template parameters:**
- **Nguyên nhân:** Tên các biến trong template không khớp với code hoặc thiếu biến
- **Giải pháp:**
  1. Vào EmailJS Dashboard > Email Templates
  2. Mở template của bạn và kiểm tra có đầy đủ các biến sau:
     - `{{from_name}}`
     - `{{from_email}}`
     - `{{phone}}`
     - `{{subject}}`
     - `{{message}}`
     - `{{newsletter}}`
  3. **QUAN TRỌNG:** 
     - Tên biến phải khớp CHÍNH XÁC (case-sensitive)
     - Không có khoảng trắng thừa trong tên biến
     - Đảm bảo format là HTML (không phải Plain Text)
  4. Nếu template cũ, copy lại template mới từ `EMAILJS_TEMPLATE.md`
  5. Không dùng `{{to_email}}` - recipient email được cấu hình trong Service
  6. Xem console log để biết biến nào bị thiếu hoặc sai

**Lỗi 400 (Bad Request):**
- Kiểm tra Service ID và Template ID có đúng không
- Đảm bảo Service đã được kích hoạt và hoạt động bình thường

**Lỗi 401 (Unauthorized):**
- Kiểm tra Public Key có đúng không
- Đảm bảo Public Key chưa bị thu hồi hoặc thay đổi

**Email không được gửi:**
- Kiểm tra Service ID, Template ID, và Public Key có đúng không
- Xem console log để biết lỗi chi tiết
- Kiểm tra email spam folder
