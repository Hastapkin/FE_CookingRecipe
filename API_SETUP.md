# API Integration Setup Guide

This project is now configured to connect to the Recipe API deployed on Render.

## Environment Configuration

1. Create a `.env` file in the root directory (copy from `.env.example`):
   ```
   VITE_API_BASE=https://recipe-api-t5t0.onrender.com/api
   ```

2. The API base URL is already set as a default in `src/services/api.ts`, so the `.env` file is optional but recommended for easy configuration changes.

## API Services

### Authentication Service (`src/services/auth.ts`)
- `login(username, password)` - User login
- `register(username, password)` - User registration
- `getProfile()` - Get current user profile (requires auth)
- `saveUserSession(user, token)` - Save user session to localStorage
- `getUserSession()` - Get current user session
- `clearUserSession()` - Clear user session
- `isAuthenticated()` - Check if user is authenticated

### Recipes Service (`src/services/recipes.ts`)
- `fetchRecipes(params?)` - Get recipes overview (public, supports filtering)
  - Query params: `search`, `difficulty`, `cookingTime`, `sortBy`, `page`, `limit`
- `fetchRecipeById(id, requireAuth?)` - Get recipe details
  - If `requireAuth` is true, requires authentication (for full details)
  - If false or unauthenticated, returns public overview
- `fetchMyRecipes(params?)` - Get user's purchased recipes (requires auth)

### Cart Service (`src/services/cart.ts`)
- `getCart()` - Get user's cart (requires auth)
- `addToCart(recipeId)` - Add recipe to cart (requires auth)
- `removeFromCart(recipeId)` - Remove recipe from cart (requires auth)

### API Service (`src/services/api.ts`)
Base service with helper functions:
- `apiGet(path, requireAuth?)` - GET request
- `apiPost(path, body?, requireAuth?)` - POST request
- `apiPut(path, body?, requireAuth?)` - PUT request
- `apiDelete(path, requireAuth?)` - DELETE request
- `apiPostFormData(path, formData, requireAuth?)` - POST with FormData (file uploads)
- `apiPutFormData(path, formData, requireAuth?)` - PUT with FormData (file uploads)

All API functions automatically include the authentication token from localStorage if available.

## Updated Pages

### Login Page (`src/pages/Login.tsx`)
- Now uses real API authentication
- Changed from email to username
- Stores JWT token in localStorage

### Register Page (`src/pages/Register.tsx`)
- Now uses real API registration
- Changed from email to username
- Automatically logs in after successful registration

### Recipes Page (`src/pages/Recipes.tsx`)
- Fetches recipes from API with filtering and pagination
- Maps frontend filters to API query parameters
- Falls back to static data if API fails

### Recipe Detail Page (`src/pages/RecipeDetail.tsx`)
- Tries to fetch with authentication first (for full details)
- Falls back to public endpoint if not authenticated
- Falls back to static data if API fails

## Authentication Flow

1. User logs in or registers
2. API returns JWT token
3. Token is stored in localStorage with user data
4. All subsequent API requests include the token in the `Authorization: Bearer <token>` header
5. Token is automatically included by the API service functions

## API Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile (requires auth)
- `GET /api/recipes` - Get recipes overview (public)
- `GET /api/recipes/{id}` - Get recipe details (auth required for full details)
- `GET /api/recipes/my-recipes` - Get purchased recipes (requires auth)
- `GET /api/cart` - Get cart (requires auth)
- `POST /api/cart` - Add to cart (requires auth)
- `DELETE /api/cart/{recipeId}` - Remove from cart (requires auth)

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test authentication:
   - Register a new user
   - Login with credentials
   - Check that user session is stored in localStorage

3. Test recipes:
   - Browse recipes (should load from API)
   - Apply filters and search
   - View recipe details

4. Test cart (requires authentication):
   - Add recipes to cart
   - View cart
   - Remove items from cart

## Notes

- The API base URL defaults to `https://recipe-api-t5t0.onrender.com/api` if not set in `.env`
- All API responses follow the format: `{ success: boolean, data: any, message?: string }`
- Authentication tokens are stored in localStorage under the `user` key
- The API service automatically handles token inclusion in requests

