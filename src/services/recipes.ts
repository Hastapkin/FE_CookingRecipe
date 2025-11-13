import { apiGet, apiPost, apiPut, apiDelete, apiPostFormData } from './api'
import type { Recipe } from '../types/recipe'

// Helper function to extract YouTube video ID from URL
function extractYouTubeVideoId(videoUrl?: string | null): string {
  if (!videoUrl) return ''
  
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = videoUrl.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  // If no match, assume it's already a video ID
  return videoUrl
}

// Transform API recipe to frontend format
function transformRecipe(apiRecipe: any): Recipe {
  const videoUrl = apiRecipe.videoUrl || apiRecipe.youtubeVideoId || ''
  const youtubeVideoId = extractYouTubeVideoId(videoUrl)
  
  return {
    ...apiRecipe,
    youtubeVideoId,
    isForSale: apiRecipe.price > 0, // Determine isForSale from price
    // Ensure difficulty is capitalized for display
    difficulty: apiRecipe.difficulty ? 
      apiRecipe.difficulty.charAt(0).toUpperCase() + apiRecipe.difficulty.slice(1) : 
      apiRecipe.difficulty
  }
}

type RecipesOverviewResponse = {
  success: boolean;
  data: {
    recipes: Recipe[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

type RecipeDetailResponse = {
  success: boolean;
  data: Recipe | null;
}

type RecipeQueryParams = {
  search?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  cookingTime?: '<30' | '30-60' | '60-120' | '>120';
  sortBy?: 'price' | 'newest' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}

export async function fetchRecipes(
  params?: RecipeQueryParams,
  options?: {
    requireAuth?: boolean
  }
): Promise<{
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const requireAuth = options?.requireAuth ?? false
  // Build query string
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.append('search', params.search)
  if (params?.difficulty) queryParams.append('difficulty', params.difficulty)
  if (params?.cookingTime) queryParams.append('cookingTime', params.cookingTime)
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const queryString = queryParams.toString()
  const path = `/recipes${queryString ? `?${queryString}` : ''}`
  
  const res = await apiGet<RecipesOverviewResponse>(path, requireAuth)
  
  // Transform recipes to add isForSale and youtubeVideoId
  const transformedRecipes = res.data.recipes.map(transformRecipe)
  
  return {
    recipes: transformedRecipes,
    pagination: res.data.pagination
  }
}

export async function fetchRecipeById(id: number, requireAuth = false): Promise<Recipe | null> {
  const res = await apiGet<RecipeDetailResponse>(`/recipes/${id}`, requireAuth)
  if (!res.data) return null
  
  // Transform recipe to add isForSale and youtubeVideoId
  return transformRecipe(res.data)
}

type RecipeMutationResponse = {
  success: boolean
  data: Recipe
  message?: string
}

type BasicResponse = {
  success: boolean
  message?: string
}

export async function createRecipe(payload: unknown): Promise<Recipe> {
  const res = await apiPost<RecipeMutationResponse>('/recipes', payload, true)
  if (!res.success || !res.data) {
    throw new Error(res.message || 'Failed to create recipe')
  }
  return transformRecipe(res.data)
}

export async function updateRecipe(id: number, payload: unknown): Promise<Recipe> {
  const res = await apiPut<RecipeMutationResponse>(`/recipes/${id}`, payload, true)
  if (!res.success || !res.data) {
    throw new Error(res.message || 'Failed to update recipe')
  }
  return transformRecipe(res.data)
}

export async function deleteRecipe(id: number): Promise<void> {
  const res = await apiDelete<BasicResponse>(`/recipes/${id}`, true)
  if (!res.success) {
    throw new Error(res.message || 'Failed to delete recipe')
  }
}

export async function uploadRecipeThumbnail(id: number, file: File): Promise<Recipe> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('recipeId', id.toString())

  const res = await apiPostFormData<RecipeMutationResponse>('/images/recipe-thumbnail', formData, true)
  if (!res.success || !res.data) {
    throw new Error(res.message || 'Failed to update recipe thumbnail')
  }
  return transformRecipe(res.data)
}

export async function fetchMyRecipes(params?: RecipeQueryParams): Promise<{
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  // Build query string
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.append('search', params.search)
  if (params?.difficulty) queryParams.append('difficulty', params.difficulty)
  if (params?.cookingTime) queryParams.append('cookingTime', params.cookingTime)
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const queryString = queryParams.toString()
  const path = `/recipes/my-recipes${queryString ? `?${queryString}` : ''}`
  
  const res = await apiGet<RecipesOverviewResponse>(path, true)
  
  // Transform recipes to add isForSale and youtubeVideoId
  const transformedRecipes = res.data.recipes.map(transformRecipe)
  
  return {
    recipes: transformedRecipes,
    pagination: res.data.pagination
  }
}
