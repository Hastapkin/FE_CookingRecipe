# Cooking Recipe - Frontend

Ứng dụng frontend cho hệ thống quản lý công thức nấu ăn, được xây dựng với React, TypeScript và Vite. Giao diện người dùng hiện đại, responsive, hỗ trợ đầy đủ các chức năng từ xem công thức, mua sắm, quản lý đơn hàng đến quản trị hệ thống.

## Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Khởi chạy](#khởi-chạy)
- [Cấu trúc Components](#cấu-trúc-components)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Build và Deploy](#build-và-deploy)
- [Troubleshooting](#troubleshooting)

## Tổng quan

Frontend application này cung cấp giao diện người dùng hoàn chỉnh cho hệ thống công thức nấu ăn, bao gồm:
- Trang chủ với công thức nổi bật
- Danh sách và tìm kiếm công thức
- Chi tiết công thức với video hướng dẫn
- Hệ thống giỏ hàng và thanh toán
- Quản lý đơn hàng cá nhân
- Quản trị hệ thống (admin)
- Đánh giá và bình luận công thức

## Tính năng

### Trang công khai
- Trang chủ với hero section và công thức nổi bật
- Danh sách công thức với phân trang
- Tìm kiếm và lọc công thức (theo độ khó, thời gian nấu)
- Xem chi tiết công thức (preview cho công thức chưa mua)
- Trang About và Contact
- Responsive design cho mobile và desktop

### Người dùng đã đăng nhập
- Xem công thức đã mua trong "My Recipes"
- Xem chi tiết đầy đủ công thức đã mua (nguyên liệu, hướng dẫn, video)
- Thêm công thức vào giỏ hàng
- Quản lý giỏ hàng
- Thanh toán và upload ảnh chứng minh
- Xem lịch sử đơn hàng trong "My Orders"
- Đánh giá và bình luận công thức đã mua
- Cập nhật ảnh đại diện

### Quản trị viên
- Quản lý công thức (CRUD)
- Xem và xử lý giao dịch (xác minh/từ chối)
- Thống kê và báo cáo
- Quản lý người dùng

### Tính năng khác
- Xác thực người dùng (đăng ký, đăng nhập)
- Phân quyền tự động (user/admin)
- Tích hợp YouTube player cho video hướng dẫn
- Upload và hiển thị hình ảnh
- Form validation
- Error handling và thông báo lỗi
- Loading states
- Scroll to top button

## Công nghệ sử dụng

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool và dev server
- **React Router DOM**: Client-side routing
- **EmailJS**: Gửi email từ form liên hệ
- **CSS3**: Styling với custom CSS

## Cấu trúc dự án

```
FE_CookingRecipe/
├── index.html              # HTML entry point
├── package.json            # Dependencies và scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── public/
│   └── images/             # Static images
│       ├── Avatar_Chef.png
│       └── hero.jpg
├── recipes/                # Text files chứa dữ liệu công thức mẫu
│   ├── BÚN CHẢ.txt
│   ├── PHỞ BÒ.txt
│   └── ...
└── src/
    ├── main.tsx            # Entry point React
    ├── App.tsx             # Main App component với routing
    ├── components/
    │   ├── Layout.tsx      # Layout wrapper với header/footer
    │   ├── PriceButton.tsx # Button hiển thị giá và thêm vào giỏ
    │   ├── ScrollToTop.tsx # Component scroll to top
    │   ├── VideoPreview.tsx # Preview video YouTube
    │   └── YouTubePlayer.tsx # Player video YouTube
    ├── pages/
    │   ├── Home.tsx        # Trang chủ
    │   ├── Recipes.tsx    # Danh sách công thức
    │   ├── RecipeDetail.tsx # Chi tiết công thức
    │   ├── Cart.tsx        # Giỏ hàng
    │   ├── Checkout.tsx    # Thanh toán
    │   ├── CheckoutSuccess.tsx # Xác nhận thanh toán
    │   ├── MyOrders.tsx    # Đơn hàng của tôi
    │   ├── MyRecipes.tsx   # Công thức đã mua
    │   ├── ProfilePicture.tsx # Cập nhật ảnh đại diện
    │   ├── Login.tsx       # Đăng nhập
    │   ├── Register.tsx    # Đăng ký
    │   ├── About.tsx       # Giới thiệu
    │   ├── Contact.tsx     # Liên hệ
    │   ├── NotFound.tsx    # 404 page
    │   └── admin/
    │       ├── AdminRecipes.tsx # Quản lý công thức (admin)
    │       ├── AdminRecipeDetail.tsx # Chi tiết công thức (admin)
    │       ├── AdminRecipeEditor.tsx # Tạo/sửa công thức (admin)
    │       └── AdminTransactions.tsx # Quản lý giao dịch (admin)
    ├── services/
    │   ├── api.ts          # API client utilities
    │   ├── auth.ts         # Service xác thực
    │   ├── recipes.ts      # Service công thức
    │   ├── cart.ts         # Service giỏ hàng
    │   ├── transactions.ts # Service giao dịch
    │   └── ratings.ts      # Service đánh giá
    ├── types/
    │   └── recipe.ts       # TypeScript interfaces
    └── styles/
        └── style.css      # Global styles
```

## Yêu cầu hệ thống

- Node.js >= 16.0.0
- npm hoặc yarn
- Backend API đang chạy (xem BE_CookingRecipe)

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd FE_CookingRecipe
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` trong thư mục gốc (nếu cần):
```env
VITE_API_BASE=http://localhost:5000/api
```

Mặc định, ứng dụng sẽ sử dụng API tại `https://recipe-api-t5t0.onrender.com/api` nếu không có biến môi trường.

## Cấu hình

### API Base URL
Cấu hình URL của backend API trong file `.env`:
```
VITE_API_BASE=https://your-api-url.com/api
```

Hoặc chỉnh sửa trực tiếp trong `src/services/api.ts`:
```typescript
const API_BASE = import.meta.env.VITE_API_BASE || 'https://recipe-api-t5t0.onrender.com/api'
```

### EmailJS (cho form liên hệ)
Nếu sử dụng form liên hệ, cấu hình EmailJS trong `src/pages/Contact.tsx`:
- Service ID
- Template ID
- Public Key

## Khởi chạy

### Development mode
```bash
npm run dev
```
Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng).

### Build cho production
```bash
npm run build
```
Files build sẽ được tạo trong thư mục `dist/`.

### Preview production build
```bash
npm run preview
```

### Type checking
```bash
npm run typecheck
```

## Cấu trúc Components

### Layout Component
`Layout.tsx` cung cấp layout chung cho toàn bộ ứng dụng:
- Header với navigation
- Footer
- Xử lý authentication state
- Redirect logic

### Page Components

#### Home
Trang chủ hiển thị:
- Hero section với hình ảnh
- Công thức nổi bật
- Call-to-action buttons

#### Recipes
Danh sách công thức với:
- Search bar
- Filters (độ khó, thời gian nấu)
- Pagination
- Grid layout responsive

#### RecipeDetail
Chi tiết công thức:
- Thông tin cơ bản (giá, độ khó, thời gian)
- Video YouTube (nếu có)
- Nguyên liệu và hướng dẫn (chỉ hiển thị nếu đã mua)
- Đánh giá và bình luận
- Button thêm vào giỏ hàng

#### Cart
Giỏ hàng:
- Danh sách công thức trong giỏ
- Tổng tiền
- Button thanh toán
- Xóa item

#### Checkout
Trang thanh toán:
- Tóm tắt đơn hàng
- Form nhập phương thức thanh toán
- Upload ảnh chứng minh thanh toán
- Submit transaction

#### MyOrders
Lịch sử đơn hàng:
- Danh sách giao dịch
- Trạng thái giao dịch (pending, verified, rejected)
- Chi tiết từng giao dịch

#### MyRecipes
Công thức đã mua:
- Danh sách công thức đã sở hữu
- Link đến chi tiết đầy đủ

#### Admin Pages
- **AdminRecipes**: Quản lý tất cả công thức (CRUD)
- **AdminRecipeEditor**: Form tạo/sửa công thức
- **AdminRecipeDetail**: Chi tiết công thức (admin view)
- **AdminTransactions**: Quản lý và xử lý giao dịch

## Routing

Ứng dụng sử dụng React Router DOM với các routes:

### Public Routes
- `/` - Trang chủ
- `/recipes` - Danh sách công thức
- `/recipe-detail/:id` - Chi tiết công thức
- `/about` - Giới thiệu
- `/contact` - Liên hệ
- `/login` - Đăng nhập
- `/register` - Đăng ký

### Protected Routes (yêu cầu đăng nhập)
- `/cart` - Giỏ hàng
- `/checkout` - Thanh toán
- `/checkout/success` - Xác nhận thanh toán
- `/my-orders` - Đơn hàng của tôi
- `/my-recipes` - Công thức đã mua
- `/profile-picture` - Cập nhật ảnh đại diện

### Admin Routes (yêu cầu quyền admin)
- `/admin/recipes` - Quản lý công thức
- `/admin/recipes/new` - Tạo công thức mới
- `/admin/recipes/:id/edit` - Sửa công thức
- `/admin/recipes/:id` - Chi tiết công thức (admin)
- `/admin/transactions` - Quản lý giao dịch

### Other
- `*` - 404 Not Found page

## State Management

Ứng dụng sử dụng:
- **Local Storage**: Lưu thông tin user và token
- **React State**: State management trong components
- **URL Parameters**: Cho routing và filters

### Authentication State
Thông tin user được lưu trong `localStorage` với key `user`:
```typescript
{
  userId: number,
  username: string,
  role: 'user' | 'admin',
  token: string
}
```

## API Integration

### API Client
File `src/services/api.ts` cung cấp các utility functions:
- `apiGet<T>()` - GET request
- `apiPost<T>()` - POST request
- `apiPut<T>()` - PUT request
- `apiDelete<T>()` - DELETE request
- `apiPostFormData<T>()` - POST với FormData (upload file)
- `apiPutFormData<T>()` - PUT với FormData (upload file)

Tất cả requests tự động thêm JWT token từ localStorage vào header `Authorization`.

### Service Modules

#### auth.ts
- `register()` - Đăng ký
- `login()` - Đăng nhập
- `getProfile()` - Lấy profile
- `logout()` - Đăng xuất

#### recipes.ts
- `getRecipes()` - Lấy danh sách công thức
- `getMyRecipes()` - Lấy công thức đã mua
- `getRecipeDetail()` - Lấy chi tiết công thức
- `createRecipe()` - Tạo công thức (admin)
- `updateRecipe()` - Cập nhật công thức (admin)
- `deleteRecipe()` - Xóa công thức (admin)

#### cart.ts
- `getCart()` - Lấy giỏ hàng
- `addToCart()` - Thêm vào giỏ hàng
- `removeFromCart()` - Xóa khỏi giỏ hàng

#### transactions.ts
- `createTransaction()` - Tạo giao dịch
- `getMyTransactions()` - Lấy giao dịch của user
- `getAllTransactions()` - Lấy tất cả giao dịch (admin)
- `submitPayment()` - Nộp ảnh chứng minh thanh toán
- `verifyTransaction()` - Xác minh giao dịch (admin)
- `rejectTransaction()` - Từ chối giao dịch (admin)

#### ratings.ts
- `getRatings()` - Lấy đánh giá của công thức
- `createRating()` - Tạo đánh giá
- `updateRating()` - Cập nhật đánh giá

## Build và Deploy

### Build
```bash
npm run build
```

Output sẽ ở thư mục `dist/` với các file đã được optimize và minify.

### Deploy lên Vercel/Netlify

1. **Vercel**:
   - Kết nối GitHub repository
   - Vercel tự động detect Vite project
   - Cấu hình environment variables nếu cần
   - Deploy

2. **Netlify**:
   - Kết nối GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy

3. **Render/Other**:
   - Upload thư mục `dist/` lên hosting
   - Cấu hình server để serve static files
   - Đảm bảo routing được handle đúng (SPA)

### Environment Variables cho Production
Thiết lập `VITE_API_BASE` trên hosting platform để trỏ đến backend API production.

## Troubleshooting

### Lỗi kết nối API
- Kiểm tra `VITE_API_BASE` đã được cấu hình đúng
- Kiểm tra backend API đang chạy
- Kiểm tra CORS settings trên backend

### Lỗi authentication
- Kiểm tra token trong localStorage
- Đảm bảo token chưa hết hạn
- Thử đăng nhập lại

### Lỗi build
- Xóa `node_modules` và `dist`, chạy lại `npm install`
- Kiểm tra TypeScript errors: `npm run typecheck`
- Kiểm tra dependencies conflicts

### Lỗi routing sau khi deploy
Đảm bảo server được cấu hình để redirect tất cả routes về `index.html` (SPA routing).

### Video YouTube không hiển thị
- Kiểm tra `videoUrl` có đúng format YouTube URL
- Kiểm tra YouTube video ID được extract đúng
- Kiểm tra YouTube API/embed không bị chặn

## Scripts

- `npm run dev`: Chạy development server
- `npm run build`: Build cho production
- `npm run preview`: Preview production build
- `npm run typecheck`: Kiểm tra TypeScript errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Dự án này được phát triển cho mục đích học tập.

## Tác giả

Phát triển bởi nhóm MSIS207.Q12.CTTT

