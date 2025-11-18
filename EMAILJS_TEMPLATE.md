# EmailJS Template - Website Branded

Template email với cùng màu sắc và style của website Cooking Recipe.

## Cách sử dụng

1. Vào EmailJS Dashboard > Email Templates > Create New Template
2. Copy **Subject Line** và paste vào ô "Subject"
3. Copy **Content** và paste vào ô "Content"
4. Chọn format: **HTML**
5. Trong phần **Settings**, tìm trường **"To Email"** và cấu hình recipient
6. Click **Save** và copy **Template ID**

---

## Template 1: Admin Email (Gửi tới phamtuan301104@gmail.com)

Template này gửi thông tin từ contact form tới admin.

### Subject Line

```
🍳 New Contact Form Message: {{subject}}
```

## Content (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #111827;
      background-color: #F9FAFB;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #FF6B35 0%,rgb(179, 138, 51) 100%);
      color: #FFFFFF;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      color: #FFFFFF;
    }
    .header-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .content {
      padding: 30px;
    }
    .info-card {
      background-color: #F9FAFB;
      border-left: 4px solid #FF6B35;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .info-row {
      display: flex;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #E5E7EB;
    }
    .info-row:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    .info-label {
      font-weight: 700;
      color: #FF6B35;
      min-width: 100px;
      font-size: 14px;
    }
    .info-value {
      color: #111827;
      flex: 1;
      font-size: 14px;
    }
    .info-value a {
      color: #FF6B35;
      text-decoration: none;
    }
    .info-value a:hover {
      color: #E5511B;
      text-decoration: underline;
    }
    .message-section {
      margin-top: 25px;
    }
    .message-title {
      color: #004E89;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .message-box {
      background-color: #FFFFFF;
      border: 2px solid #E5E7EB;
      border-radius: 8px;
      padding: 20px;
      color: #111827;
      line-height: 1.8;
      white-space: pre-wrap;
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-yes {
      background-color: #10B981;
      color: #FFFFFF;
    }
    .badge-no {
      background-color: #6B7280;
      color: #FFFFFF;
    }
    .footer {
      background-color: #F9FAFB;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    .footer-text {
      color: #4B5563;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .footer-link {
      color: #FF6B35;
      text-decoration: none;
      font-weight: 600;
    }
    .footer-link:hover {
      color: #E5511B;
      text-decoration: underline;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #E5E7EB, transparent);
      margin: 25px 0;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }
      .content {
        padding: 20px;
      }
      .info-row {
        flex-direction: column;
      }
      .info-label {
        margin-bottom: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-icon">🍳</div>
      <h1>New Contact Form Message</h1>
    </div>
    
    <div class="content">
      <div class="info-card">
        <div class="info-row">
          <span class="info-label">👤 From:</span>
          <span class="info-value">{{from_name}} <a href="mailto:{{from_email}}">&lt;{{from_email}}&gt;</a></span>
        </div>
        
        <div class="info-row">
          <span class="info-label">📱 Phone:</span>
          <span class="info-value">{{phone}}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">🏷️ Subject:</span>
          <span class="info-value">{{subject}}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">📬 Newsletter:</span>
          <span class="info-value">{{newsletter}}</span>
        </div>
      </div>
      
      <div class="message-section">
        <div class="message-title">
          💬 Message:
        </div>
        <div class="message-box">{{message}}</div>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="footer">
      <p class="footer-text">
        This message was sent from the <strong style="color: #FF6B35;">Cooking Recipe</strong> website contact form.
      </p>
      <p class="footer-text">
        Reply to: <a href="mailto:{{from_email}}" class="footer-link">{{from_email}}</a>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## Template 2: Confirmation Email (Gửi cho người gửi form)

Template này gửi email xác nhận cho người đã gửi contact form.

### Subject Line

```
Thank You for Contacting Us - Cooking Recipe
```

### Content (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #111827;
      background-color: #F9FAFB;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #FF6B35 0%,rgb(179, 138, 51) 100%);
      color: #FFFFFF;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      color: #FFFFFF;
    }
    .header-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .content {
      padding: 30px;
    }
    .success-icon {
      text-align: center;
      font-size: 48px;
      margin-bottom: 20px;
    }
    .greeting {
      font-size: 18px;
      color: #111827;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .message {
      color: #4B5563;
      line-height: 1.8;
      margin-bottom: 20px;
    }
    .info-box {
      background-color: #F9FAFB;
      border-left: 4px solid #10B981;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 0;
      color: #111827;
      font-size: 14px;
    }
    .footer {
      background-color: #F9FAFB;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    .footer-text {
      color: #4B5563;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .footer-link {
      color: #FF6B35;
      text-decoration: none;
      font-weight: 600;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }
      .content {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-icon">🍳</div>
      <h1>Thank You for Contacting Us!</h1>
    </div>
    
    <div class="content">
      <div class="success-icon">✓</div>
      
      <p class="greeting">Hello {{user_name}},</p>
      
      <p class="message">
        We have received your message regarding "<strong>{{subject}}</strong>" and we truly appreciate you taking the time to reach out to us.
      </p>
      
      <p class="message">
        Our team will review your message and get back to you as soon as possible, typically within 24 hours.
      </p>
      
      <div class="info-box">
        <p><strong>📧 Your Message Subject:</strong> {{subject}}</p>
      </div>
      
      <p class="message">
        If you have any urgent questions or concerns, please don't hesitate to contact us directly.
      </p>
      
      <p class="message">
        Best regards,<br>
        <strong style="color: #FF6B35;">Cooking Recipe Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p class="footer-text">
        This is an automated confirmation email from <strong style="color: #FF6B35;">Cooking Recipe</strong>
      </p>
      <p class="footer-text">
        Visit us at: <a href="#" class="footer-link">www.cookingrecipe.com</a>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## Lưu ý

### Template 1 (Admin Email):
- Template này gửi tới admin (`phamtuan301104@gmail.com`) với thông tin từ form
- Sử dụng màu sắc của website: Primary `#FF6B35`, Secondary `#004E89`
- Biến: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{subject}}`, `{{message}}`, `{{newsletter}}`, `{{to_email}}`

### Template 2 (Confirmation Email):
- Template này gửi tới người gửi form để xác nhận đã nhận được message
- Biến: `{{user_name}}`, `{{subject}}`, `{{email}}` (dùng trong "To Email" field)
- Format: HTML
- **Lưu ý:** Trong Settings > "To Email", điền `{{email}}` (code sẽ gửi email người gửi vào biến này)

### Cách sử dụng:
1. Tạo 2 template riêng trong EmailJS Dashboard
2. Template 1: Dùng cho admin (copy Template 1 ở trên)
3. Template 2: Dùng cho confirmation (copy Template 2 ở trên)
4. Lưu Template ID của Template 2 vào `.env` với key `VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID`
