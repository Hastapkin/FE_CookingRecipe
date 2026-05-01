import { apiGet, apiPost, apiPut } from './api'
import {
  APP_EVENTS,
  clearStoredSession,
  emitAppEvent,
  readStoredSession,
  writeStoredSession
} from '../config/session'

export interface User {
  id: number
  username: string
  name?: string | null
  email?: string | null
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
  const response = await apiPost<RegisterResponse>(
    '/auth/register',
    { name: username, email: `${username}@example.com`, username, password },
    false
  )
  return response
}

export async function registerWithProfile(
  name: string,
  email: string,
  username: string,
  password: string
): Promise<RegisterResponse> {
  const response = await apiPost<RegisterResponse>('/auth/register', { name, email, username, password }, false)
  return response
}

export async function getProfile(): Promise<User> {
  const response = await apiGet<ProfileResponse>('/auth/profile', true)
  return response.user
}

export async function updateProfile(name: string, email: string): Promise<User> {
  const response = await apiPut<{ success: boolean; user: User; message?: string }>(
    '/auth/profile',
    { name, email },
    true
  )
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
  writeStoredSession({ ...user, token })
  emitAppEvent(APP_EVENTS.AUTH_STATE_CHANGED)
}

export function getUserSession(): { user: User; token: string } | null {
  const data = readStoredSession() as {
    user?: User
    token?: string
    id?: number
    username?: string
    name?: string | null
    email?: string | null
    profilePicture?: string | null
    role?: string
    createdAt?: string
  } | null

  if (!data) {
    return null
  }

  const rawUser = data.user ? data.user : data
  if (!rawUser?.id || !rawUser?.username || !rawUser?.role || !data.token) {
    return null
  }

  return {
    user: {
      id: rawUser.id,
      username: rawUser.username,
      name: rawUser.name,
      email: rawUser.email,
      profilePicture: rawUser.profilePicture,
      role: rawUser.role,
      createdAt: rawUser.createdAt
    },
    token: data.token
  }
}

export function clearUserSession(): void {
  clearStoredSession()
  emitAppEvent(APP_EVENTS.AUTH_STATE_CHANGED)
}

export function isAuthenticated(): boolean {
  return getUserSession() !== null
}

