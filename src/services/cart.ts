import { apiGet, apiPost, apiDelete } from './api'
import type { Recipe } from '../types/recipe'

export interface CartItem {
  id: number
  recipeId: number
  title: string
  videoThumbnail?: string | null
  price: number
  difficulty: string
  cookingTime: number
  category: string
  addedAt: string
}

export interface CartResponse {
  success: boolean
  data: {
    items: CartItem[]
    total: number
    itemCount: number
  }
}

export interface AddToCartResponse {
  success: boolean
  message: string
  data: {
    id: number
    userId: number
    recipeId: number
    recipeTitle: string
    price: number
    addedAt: string
  }
}

export interface RemoveFromCartResponse {
  success: boolean
  message: string
  data: {
    cartId: number
    recipeId: number
  }
}

export async function getCart(): Promise<CartResponse['data']> {
  const response = await apiGet<CartResponse>('/cart', true)
  return response.data
}

export async function addToCart(recipeId: number): Promise<AddToCartResponse> {
  const response = await apiPost<AddToCartResponse>('/cart', { recipeId }, true)
  return response
}

export async function removeFromCart(recipeId: number): Promise<RemoveFromCartResponse> {
  const response = await apiDelete<RemoveFromCartResponse>(`/cart/${recipeId}`, true)
  return response
}

