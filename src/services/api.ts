const API_BASE = import.meta.env.VITE_API_BASE || 'https://fe-cooking-recipe.vercel.app/api'

// Get authentication token from localStorage
function getAuthToken(): string | null {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      return user.token || null
    } catch {
      return null
    }
  }
  return null
}

// Build headers with authentication if available
function buildHeaders(includeAuth = true, customHeaders: Record<string, string> = {}): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders
  }
  
  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

export async function apiGet<T>(path: string, requireAuth = false, init?: RequestInit): Promise<T> {
  const token = requireAuth ? getAuthToken() : null
  if (requireAuth && !token) {
    throw new Error('Authentication required')
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: buildHeaders(requireAuth, {}),
    ...init
  })
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`GET ${path} failed: ${res.status} ${errorText}`)
  }
  return res.json()
}

export async function apiPost<T>(path: string, body?: unknown, requireAuth = false, init?: RequestInit): Promise<T> {
  const token = requireAuth ? getAuthToken() : null
  if (requireAuth && !token) {
    throw new Error('Authentication required')
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: buildHeaders(requireAuth, {}),
    body: body ? JSON.stringify(body) : undefined,
    ...init
  })
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`POST ${path} failed: ${res.status} ${errorText}`)
  }
  return res.json()
}

export async function apiPut<T>(path: string, body?: unknown, requireAuth = false, init?: RequestInit): Promise<T> {
  const token = requireAuth ? getAuthToken() : null
  if (requireAuth && !token) {
    throw new Error('Authentication required')
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: buildHeaders(requireAuth, {}),
    body: body ? JSON.stringify(body) : undefined,
    ...init
  })
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`PUT ${path} failed: ${res.status} ${errorText}`)
  }
  return res.json()
}

export async function apiDelete<T>(path: string, requireAuth = false, init?: RequestInit): Promise<T> {
  const token = requireAuth ? getAuthToken() : null
  if (requireAuth && !token) {
    throw new Error('Authentication required')
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(requireAuth, {}),
    ...init
  })
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`DELETE ${path} failed: ${res.status} ${errorText}`)
  }
  return res.json()
}

// For multipart/form-data (file uploads)
export async function apiPostFormData<T>(path: string, formData: FormData, requireAuth = false): Promise<T> {
  const token = requireAuth ? getAuthToken() : null
  if (requireAuth && !token) {
    throw new Error('Authentication required')
  }

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  // Don't set Content-Type for FormData - browser will set it with boundary

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData
  })
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`POST ${path} failed: ${res.status} ${errorText}`)
  }
  return res.json()
}

export async function apiPutFormData<T>(path: string, formData: FormData, requireAuth = false): Promise<T> {
  const token = requireAuth ? getAuthToken() : null
  if (requireAuth && !token) {
    throw new Error('Authentication required')
  }

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers,
    body: formData
  })
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`PUT ${path} failed: ${res.status} ${errorText}`)
  }
  return res.json()
}
