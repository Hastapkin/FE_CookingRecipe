import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createCourse,
  fetchAdminCourseDetail,
  updateCourse,
  type AdminCoursePayload,
  type CourseOverviewDetail
} from '../../services/courses'

function sanitizeCourseForEditing(detail: CourseOverviewDetail): AdminCoursePayload {
  return {
    title: detail.course.title || '',
    description: detail.course.description || '',
    thumbnail: detail.course.thumbnail || '',
    price: Number(detail.course.price || 0),
    difficulty: (detail.course.difficulty?.toLowerCase() as AdminCoursePayload['difficulty']) || 'beginner',
    duration: Number(detail.course.duration || 0),
    category: detail.course.category || '',
    modules: (detail.modules || []).map((module) => ({
      title: module.title,
      description: module.description || '',
      order: module.order,
      lessons: (module.lessons || []).map((lesson) => ({
        title: lesson.title,
        description: lesson.description || '',
        order: lesson.order,
        contentType: (lesson.contentType?.toLowerCase() as 'article' | 'video' | 'assignment') || 'article',
        durationMinutes: Number(lesson.durationMinutes || 0),
        content: {
          articleText: lesson.contentType?.toLowerCase() === 'article' ? (lesson as any).content?.articleText || '' : null,
          videoUrl: lesson.contentType?.toLowerCase() === 'video' ? (lesson as any).content?.videoUrl || '' : null,
          videoDuration: lesson.contentType?.toLowerCase() === 'video' ? Number((lesson as any).content?.videoDuration || 0) : null,
          assignmentQuestions: lesson.contentType?.toLowerCase() === 'assignment' ? ((lesson as any).content?.assignmentQuestions || []) : [],
          passingScore: lesson.contentType?.toLowerCase() === 'assignment' ? Number((lesson as any).content?.passingScore || 70) : 70
        }
      }))
    }))
  }
}

function AdminCourseEditor() {
  const { id } = useParams<{ id: string }>()
  const courseId = id ? Number(id) : null
  const isEdit = Boolean(courseId)
  const navigate = useNavigate()

  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && courseId) {
      const loadCourse = async () => {
        try {
          setLoading(true)
          setError(null)
          const data = await fetchAdminCourseDetail(courseId)
          const payload = sanitizeCourseForEditing(data)
          setJsonInput(JSON.stringify(payload, null, 2))
        } catch (err) {
          console.error('Failed to load course', err)
          setError('Failed to load course. Please try again later.')
        } finally {
          setLoading(false)
        }
      }

      loadCourse()
    } else {
      setJsonInput(`{
  "title": "",
  "description": "",
  "thumbnail": "",
  "price": 0,
  "difficulty": "beginner",
  "duration": 0,
  "category": "",
  "modules": [
    {
      "title": "",
      "description": "",
      "order": 1,
      "lessons": [
        {
          "title": "",
          "description": "",
          "order": 1,
          "contentType": "article",
          "durationMinutes": 0,
          "content": {
            "articleText": ""
          }
        }
      ]
    }
  ]
}`)
    }
  }, [isEdit, navigate, courseId])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError(null)
      const parsed = JSON.parse(jsonInput) as AdminCoursePayload

      if (isEdit && courseId) {
        await updateCourse(courseId, parsed)
        alert('Course updated successfully.')
      } else {
        await createCourse(parsed)
        alert('Course created successfully.')
      }

      navigate('/admin/courses')
    } catch (err) {
      console.error('Failed to save course', err)
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your input.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to save course. Please try again later.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="admin-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{isEdit ? 'Edit Course' : 'Add New Course'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update the course JSON payload and save your changes.' : 'Paste or write the course JSON payload, then submit to create the course.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner large"></div>
              <p>Loading course data...</p>
            </div>
          ) : (
            <form className="admin-recipe-editor" onSubmit={handleSubmit}>
              {error && (
                <div className="error-message" style={{ marginBottom: '1.5rem' }}>
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>{error}</p>
                </div>
              )}

              <label htmlFor="recipeJson" className="form-label">
                Course JSON
              </label>
              <textarea
                id="recipeJson"
                className="json-textarea"
                rows={24}
                value={jsonInput}
                onChange={(event) => setJsonInput(event.target.value)}
                spellCheck={false}
              />

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/admin/courses')}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      {isEdit ? ' Saving...' : ' Creating...'}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      {isEdit ? ' Save Changes' : ' Create Course'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default AdminCourseEditor
