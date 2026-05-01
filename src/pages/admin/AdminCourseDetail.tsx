import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteCourse, fetchAdminCourseDetail, uploadCourseThumbnail, type CourseOverviewDetail } from '../../services/courses'

function AdminCourseDetail() {
  const { id } = useParams<{ id: string }>()
  const courseId = id ? Number(id) : null
  const navigate = useNavigate()

  const [detail, setDetail] = useState<CourseOverviewDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)

  useEffect(() => {
    if (!courseId) {
      navigate('/admin/courses')
      return
    }

    const loadCourse = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchAdminCourseDetail(courseId)
        setDetail(data)
      } catch (err) {
        console.error('Failed to load course', err)
        setError('Failed to load course details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [navigate, courseId])

  const handleDelete = async () => {
    if (!courseId) return
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteCourse(courseId)
      alert('Course deleted successfully.')
      navigate('/admin/courses')
    } catch (err) {
      console.error('Failed to delete course', err)
      alert(err instanceof Error ? err.message : 'Failed to delete course. Please try again later.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!courseId) return
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setThumbnailUploading(true)
      await uploadCourseThumbnail(courseId, file)
      const refreshed = await fetchAdminCourseDetail(courseId)
      setDetail(refreshed)
      alert('Course image updated successfully.')
    } catch (err) {
      console.error('Failed to update course image', err)
      alert(err instanceof Error ? err.message : 'Failed to update course image. Please try again later.')
    } finally {
      setThumbnailUploading(false)
      event.target.value = ''
    }
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="loading-container" style={{ padding: '4rem 0' }}>
          <div className="loading-spinner large"></div>
          <p>Loading course...</p>
        </div>
      </main>
    )
  }

  if (error || !detail) {
    return (
      <main className="admin-page">
        <section className="page-header">
          <div className="container">
          <h1 className="page-title">Manage Course Detail</h1>
          <p className="page-subtitle">View and manage course information</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error || 'Course not found.'}</p>
              <button className="btn btn-outline" onClick={() => navigate('/admin/courses')}>
                Back to courses
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const { course, modules } = detail

  return (
    <main className="admin-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Manage Course Detail</h1>
          <p className="page-subtitle">{course.title} - manage course content and assets</p>
          <div className="page-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
            >
              <i className="fas fa-edit"></i>
              Edit JSON
            </button>
            <button
              className="btn btn-outline"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Deleting...
                </>
              ) : (
                <>
                  <i className="fas fa-trash"></i> Delete
                </>
              )}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/admin/courses')}
            >
              <i className="fas fa-arrow-left"></i>
              Back to list
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-recipe-detail-grid">
            <div className="admin-recipe-video">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: '100%', borderRadius: '12px', maxHeight: '400px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ borderRadius: '12px', border: '1px dashed #ccc', minHeight: '260px', display: 'grid', placeItems: 'center' }}>
                  <span style={{ color: '#777' }}>No course image uploaded</span>
                </div>
              )}
              <div className="thumbnail-upload">
                <label className="file-upload-label" style={{ width: '100%' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={thumbnailUploading}
                    className="file-input"
                  />
                  <div className="file-upload-button">
                    {thumbnailUploading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-image"></i>
                        <span>Change Course Image</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="admin-recipe-meta">
              <div className="meta-grid">
                <div>
                  <h4>Category</h4>
                  <p>{course.category || '—'}</p>
                </div>
                <div>
                  <h4>Difficulty</h4>
                  <p>{course.difficulty || '—'}</p>
                </div>
                <div>
                  <h4>Duration</h4>
                  <p>{course.duration !== null && course.duration !== undefined ? `${course.duration} mins` : '—'}</p>
                </div>
                <div>
                  <h4>Modules</h4>
                  <p>{modules.length}</p>
                </div>
                <div>
                  <h4>Price</h4>
                  <p>${course.price?.toFixed(2) ?? '0.00'}</p>
                </div>
              </div>

              <div className="admin-recipe-description">
                <h3>Description</h3>
                <p>{course.description || 'No description provided.'}</p>
              </div>

              <div className="admin-recipe-section">
                <h3>Modules & Lessons</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {modules.map((module) => (
                    <div key={module.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '0.75rem' }}>
                      <strong>{module.order}. {module.title}</strong>
                      <p style={{ margin: '0.35rem 0', color: '#666' }}>{module.description || 'No description.'}</p>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                        {module.lessons.map((lesson) => (
                          <li key={lesson.id}>
                            {lesson.order}. {lesson.title} ({lesson.contentType || 'article'})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminCourseDetail
