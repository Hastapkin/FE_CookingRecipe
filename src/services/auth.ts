import { apiGet, apiPost } from './api'

export interface User {
  id: number
  username: string
  profilePicture?: string | null
  role: string
  createdAt?: string
}

export interface LoginResponse {
  success: boolean
  message: string
  user: User
  token: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  user: User
  token: string
}

export interface ProfileResponse {
  success: boolean
  user: User
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await apiPost<LoginResponse>('/auth/login', { username, password }, false)
  return response
}

export async function register(username: string, password: string): Promise<RegisterResponse> {
  const response = await apiPost<RegisterResponse>('/auth/register', { username, password }, false)
  return response
}

export async function getProfile(): Promise<User> {
  const response = await apiGet<ProfileResponse>('/auth/profile', true)
  return response.user
}

export interface UploadProfilePictureResponse {
  success: boolean
  message: string
  data: {
    imageUrl: string
    publicId: string
  }
}

export async function uploadProfilePicture(file: File): Promise<UploadProfilePictureResponse> {
  const { apiPostFormData } = await import('./api')
  const formData = new FormData()
  formData.append('image', file) // Backend expects 'image' field name
  const response = await apiPostFormData<UploadProfilePictureResponse>('/images/profile', formData, true)
  return response
}

// Helper functions for managing user session
export function saveUserSession(user: User, token: string): void {
  localStorage.setItem('user', JSON.stringify({ ...user, token }))
  // Dispatch custom event to notify Layout component
  window.dispatchEvent(new Event('authStateChanged'))
}

export function getUserSession(): { user: User; token: string } | null {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  
  try {
    const data = JSON.parse(userStr)
    return {
      user: {
        id: data.id,
        username: data.username,
        profilePicture: data.profilePicture,
        role: data.role,
        createdAt: data.createdAt
      },
      token: data.token
    }
  } catch {
    return null
  }
}

export function clearUserSession(): void {
  localStorage.removeItem('user')
  // Dispatch custom event to notify Layout component
  window.dispatchEvent(new Event('authStateChanged'))
}

export function isAuthenticated(): boolean {
  return getUserSession() !== null
}

