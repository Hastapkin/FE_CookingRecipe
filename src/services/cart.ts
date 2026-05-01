import { apiGet, apiPost, apiDelete } from './api'

/** Cart line item normalized for course checkout flows. */
export interface CartItem {
  id: number
  cartId: number
  courseId: number
  /** @deprecated legacy recipe linkage; mirrors courseId */
  recipeId?: number
  title: string
  thumbnail?: string | null
  /** @deprecated use thumbnail */
  videoThumbnail?: string | null
  price: number
  discountedPrice?: number
  difficulty: string
  /** Approximate lesson count for display */
  lessonCount?: number
  /** Estimated course duration (minutes), from catalog */
  estimatedDurationMinutes?: number
  /** @deprecated use estimatedDurationMinutes */
  cookingTime?: number
  /** @deprecated not used for courses */
  category?: string
}

export interface CartData {
  items: CartItem[]
  total: number
  totalPrice: number
  itemCount: number
}

export interface CartResponse {
  success: boolean
  data: CartData
}

export interface AddToCartResponse {
  success: boolean
  message?: string
  alreadyInCart?: boolean
  data?: {
    cart?: CartItem[]
  }
}

export interface RemoveFromCartResponse {
  success: boolean
  message?: string
  data?: Record<string, unknown>
}

function mapServerCartCourse(raw: Record<string, unknown>): CartItem {
  const cartId = Number(raw.cartId ?? raw.cartid ?? raw.itemId)
  const courseId = Number(raw.courseId ?? raw.courseid)
  const discounted = Number(raw.discountedPrice ?? raw.discountedprice ?? raw.price ?? 0)
  const price = Number(raw.price ?? discounted)
  const lessonCount =
    typeof raw.lessonCount === 'number'
      ? raw.lessonCount
      : typeof raw.lesson_count === 'number'
        ? raw.lesson_count
        : Number(raw.lesson_count ?? raw.lessonCount ?? 0)
  const mins = Number(raw.estimatedDurationMinutes ?? raw.durationminutes ?? raw.durationMinutes ?? 0)

  const thumb = (raw.thumbnail as string | null | undefined) ?? null

  return {
    id: cartId || courseId,
    cartId,
    courseId,
    recipeId: courseId,
    title: String(raw.title ?? ''),
    thumbnail: thumb,
    videoThumbnail: thumb,
    price: Number.isFinite(discounted) ? discounted : price,
    discountedPrice: Number.isFinite(discounted) ? discounted : price,
    difficulty: String(raw.difficultyLevel ?? raw.difficulty ?? ''),
    lessonCount,
    estimatedDurationMinutes: mins,
    cookingTime: mins,
    category: 'Course'
  }
}

export async function getCart(): Promise<CartData> {
  const response = await apiGet<CartResponse>('/cart', true)
  const items = Array.isArray(response.data.items)
    ? response.data.items.map((row) => mapServerCartCourse(row as unknown as Record<string, unknown>))
    : []

  const totalPrice = typeof response.data.totalPrice === 'number' ? response.data.totalPrice : response.data.total ?? 0

  return {
    items,
    total: totalPrice,
    totalPrice,
    itemCount: items.length
  }
}

export async function addToCart(courseId: number): Promise<AddToCartResponse> {
  return apiPost<AddToCartResponse>('/cart', { courseId }, true)
}

export async function removeFromCart(courseId: number): Promise<RemoveFromCartResponse> {
  return apiDelete<RemoveFromCartResponse>(`/cart/${courseId}`, true)
}
