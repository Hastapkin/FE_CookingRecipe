import { apiGet } from './api'
import type { Recipe } from '../types/recipe'

type RecipesResponse = {
  success: boolean;
  data: Recipe[];
  count: number;
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await apiGet<RecipesResponse>('/recipes')
  return res.data ?? []
}

export async function fetchRecipeById(id: number): Promise<Recipe | null> {
  const res = await apiGet<{ success: boolean; data: Recipe | null }>(`/recipes/${id}`)
  return res.data ?? null
}
