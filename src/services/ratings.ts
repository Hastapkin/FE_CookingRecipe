import { apiGet, apiPost, apiDelete } from './api'

export interface Rating {
  id: number
  recipeId: number
  userId: number
  username: string
  ratingScore: number
  comment?: string | null
  createdAt: string
  updatedAt?: string
}

export interface RatingsResponse {
  success: boolean
  data: {
    average: number
    total: number
    ratings: Rating[]
  }
}

export interface MyRatingResponse {
  success: boolean
  data: Rating | null
}

export interface SubmitRatingResponse {
  success: boolean
  message: string
  data: Rating
}

export async function getRecipeRatings(recipeId: number): Promise<RatingsResponse['data']> {
  const response = await apiGet<RatingsResponse>(`/ratings/recipe/${recipeId}`, false)
  return response.data
}

export async function getMyRating(recipeId: number): Promise<Rating | null> {
  const response = await apiGet<MyRatingResponse>(`/ratings/my-rating/${recipeId}`, true)
  return response.data
}

export async function submitRating(recipeId: number, ratingScore: number, comment?: string): Promise<Rating> {
  const response = await apiPost<SubmitRatingResponse>(
    `/ratings/recipe/${recipeId}`,
    { ratingScore, comment },
    true
  )
  return response.data
}

export async function deleteRating(ratingId: number): Promise<void> {
  await apiDelete(`/ratings/${ratingId}`, true)
}

