import { apiDelete, apiGet, apiPost, apiPostFormData, apiPut } from './api'
import { getUserSession } from './auth'

export type CourseOverview = {
  id: number
  title: string
  description?: string
  thumbnail?: string | null
  price: number
  difficulty: string
  duration?: number | null
  createdAt?: string | null
  moduleCount: number
  rating: number
}

export type AssignmentQuestion = {
  question: string
  options: string[]
  correct: number
}

export type CourseModuleLesson = {
  id: number
  title: string
  description?: string | null
  order: number
  contentType?: string | null
  durationMinutes?: number | null
  updatedAt?: string | null
  content?: {
    articleText?: string | null
    videoUrl?: string | null
    videoDuration?: number | null
    assignmentQuestions?: AssignmentQuestion[]
    passingScore?: number
  }
}

export type CourseModule = {
  id: number
  title: string
  description?: string | null
  order: number
  updatedAt?: string | null
  lessons: CourseModuleLesson[]
}

export type CourseOverviewDetail = {
  course: {
    id: number
    title: string
    description?: string | null
    thumbnail?: string | null
    price: number
    difficulty?: string | null
    duration?: number | null
    moduleCount?: number | null
    category?: string | null
    viewCount?: number | null
    purchaseCount?: number | null
    rating?: number | null
    createdAt?: string | null
    updatedAt?: string | null
  }
  modules: CourseModule[]
}

export type CourseLearningLesson = {
  id: number
  title: string
  description?: string | null
  order: number
  contentType?: string | null
  durationMinutes?: number | null
  isCompleted: boolean
  score?: number | null
  content: {
    articleText?: string | null
    videoUrl?: string | null
    videoDuration?: number | null
    assignmentQuestions: AssignmentQuestion[]
    passingScore: number
  }
}

export type CourseLearningModule = {
  id: number
  title: string
  description?: string | null
  order: number
  lessons: CourseLearningLesson[]
}

export type CourseLearningDetail = {
  course: {
    id: number
    title: string
    description?: string | null
    thumbnail?: string | null
    difficulty?: string | null
    duration?: number | null
    moduleCount?: number | null
  }
  modules: CourseLearningModule[]
  progress: {
    completedLessons: number
    totalLessons: number
    percent: number
  }
}

export type CourseReview = {
  id: number
  userId: number
  username: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export type AdminCourseLessonPayload = {
  title: string
  description?: string | null
  order?: number
  contentType: 'article' | 'video' | 'assignment'
  durationMinutes?: number
  content?: {
    articleText?: string | null
    videoUrl?: string | null
    videoDuration?: number | null
    assignmentQuestions?: AssignmentQuestion[]
    passingScore?: number
  }
}

export type AdminCourseModulePayload = {
  title: string
  description?: string | null
  order?: number
  lessons?: AdminCourseLessonPayload[]
}

export type AdminCoursePayload = {
  title: string
  description?: string | null
  thumbnail?: string | null
  price?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  duration?: number
  category?: string | null
  modules?: AdminCourseModulePayload[]
}

type CourseQueryParams = {
  search?: string
  sortBy?: 'price' | 'newest' | 'rating' | 'popular'
  page?: number
  limit?: number
}

type CoursesOverviewResponse = {
  success: boolean
  data: {
    courses: CourseOverview[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

type CourseOverviewDetailResponse = {
  success: boolean
  data: CourseOverviewDetail
}

type CourseLearningDetailResponse = {
  success: boolean
  data: CourseLearningDetail
}

type AssignmentSubmitResponse = {
  success: boolean
  data: {
    score: number
    passed: boolean
    passingScore: number
    learning: CourseLearningDetail
  }
}

type AdminCourseMutationResponse = {
  success: boolean
  data: CourseOverviewDetail
  message?: string
}

type BasicResponse = {
  success: boolean
  message?: string
}

type CourseReviewsResponse = {
  success: boolean
  data: {
    summary: {
      rating: number
      count: number
    }
    canReview: boolean
    myReview: CourseReview | null
    reviews: CourseReview[]
  }
}

export async function fetchCourses(params?: CourseQueryParams): Promise<{
  courses: CourseOverview[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}> {
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.append('search', params.search)
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  const queryString = queryParams.toString()
  const path = `/courses${queryString ? `?${queryString}` : ''}`
  const res = await apiGet<CoursesOverviewResponse>(path)
  return { courses: res.data.courses, pagination: res.data.pagination }
}

export async function fetchCourseOverviewDetail(id: number): Promise<CourseOverviewDetail> {
  const res = await apiGet<CourseOverviewDetailResponse>(`/courses/${id}`)
  return res.data
}

export async function fetchAdminCourseDetail(id: number): Promise<CourseOverviewDetail> {
  const res = await apiGet<CourseOverviewDetailResponse>(`/courses/${id}/admin`, true)
  return res.data
}

type PurchasesResponse = {
  success: boolean
  data: { courseIds: number[] }
}

export async function fetchPurchasedCourseIds(): Promise<number[]> {
  try {
    const res = await apiGet<PurchasesResponse>('/courses/me/purchases', true)
    return (res.data.courseIds ?? []).map((n) => Number(n))
  } catch {
    return []
  }
}

export async function fetchCourseLearningDetail(id: number): Promise<CourseLearningDetail> {
  const res = await apiGet<CourseLearningDetailResponse>(`/courses/${id}/learn`, true)
  return res.data
}

export async function downloadCourseCertificate(id: number): Promise<void> {
  const session = getUserSession()
  if (!session?.token) {
    throw new Error('Authentication required')
  }

  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
  const res = await fetch(`${base}/courses/${id}/certificate`, {
    headers: {
      Authorization: `Bearer ${session.token}`
    }
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`Download certificate failed: ${res.status} ${errorText}`)
  }

  const blob = await res.blob()
  const contentDisposition = res.headers.get('content-disposition') || ''
  const nameMatch = contentDisposition.match(/filename="([^"]+)"/i)
  const fileName = nameMatch?.[1] || `course_certificate_${id}.pdf`
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function updateLessonProgress(courseId: number, lessonId: number, isCompleted: boolean): Promise<CourseLearningDetail> {
  const res = await apiPut<CourseLearningDetailResponse>(`/courses/${courseId}/lessons/${lessonId}/progress`, { isCompleted }, true)
  return res.data
}

export async function submitAssignment(
  courseId: number,
  lessonId: number,
  answers: number[]
): Promise<{ score: number; passed: boolean; passingScore: number; learning: CourseLearningDetail }> {
  const res = await apiPost<AssignmentSubmitResponse>(`/courses/${courseId}/lessons/${lessonId}/assignment/submit`, { answers }, true)
  return res.data
}

export async function createCourse(payload: AdminCoursePayload): Promise<CourseOverviewDetail> {
  const res = await apiPost<AdminCourseMutationResponse>('/courses', payload, true)
  if (!res.success || !res.data) throw new Error(res.message || 'Failed to create course')
  return res.data
}

export async function updateCourse(id: number, payload: AdminCoursePayload): Promise<CourseOverviewDetail> {
  const res = await apiPut<AdminCourseMutationResponse>(`/courses/${id}`, payload, true)
  if (!res.success || !res.data) throw new Error(res.message || 'Failed to update course')
  return res.data
}

export async function deleteCourse(id: number): Promise<void> {
  const res = await apiDelete<BasicResponse>(`/courses/${id}`, true)
  if (!res.success) throw new Error(res.message || 'Failed to delete course')
}

export async function uploadCourseThumbnail(id: number, file: File): Promise<void> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('courseId', id.toString())
  const res = await apiPostFormData<{ success: boolean; message?: string }>('/images/course-thumbnail', formData, true)
  if (!res.success) throw new Error(res.message || 'Failed to update course thumbnail')
}

export async function fetchCourseReviews(id: number): Promise<CourseReviewsResponse['data']> {
  const requireAuth = Boolean(getUserSession()?.token)
  const res = await apiGet<CourseReviewsResponse>(`/courses/${id}/reviews`, requireAuth)
  return res.data
}

export async function saveCourseReview(id: number, rating: number, comment: string): Promise<CourseReview> {
  const res = await apiPost<{ success: boolean; data: CourseReview; message?: string }>(
    `/courses/${id}/reviews`,
    { rating, comment },
    true
  )
  if (!res.success || !res.data) throw new Error(res.message || 'Failed to save review')
  return res.data
}

export async function updateCourseReview(id: number, rating: number, comment: string): Promise<CourseReview> {
  const res = await apiPut<{ success: boolean; data: CourseReview; message?: string }>(
    `/courses/${id}/reviews`,
    { rating, comment },
    true
  )
  if (!res.success || !res.data) throw new Error(res.message || 'Failed to update review')
  return res.data
}

export async function deleteCourseReview(id: number): Promise<void> {
  const res = await apiDelete<BasicResponse>(`/courses/${id}/reviews`, true)
  if (!res.success) throw new Error(res.message || 'Failed to delete review')
}
