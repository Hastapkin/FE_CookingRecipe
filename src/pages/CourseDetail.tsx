import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchCourseOverviewDetail, type CourseOverviewDetail } from '../services/courses'

function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const [detail, setDetail] = useState<CourseOverviewDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const result = await fetchCourseOverviewDetail(Number(id))
        if (!cancelled) {
          setDetail(result)
        }
      } catch (error) {
        console.error('Failed to load course overview', error)
        if (!cancelled) {
          setDetail(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const formatDate = (value?: string | null) => {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString()
  }

  const formatDuration = (duration?: number | null) => {
    if (!duration || duration <= 0) return 'Self-paced'
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const formatPrice = (price?: number | null) => {
    if (price === null || price === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
  }

  const getDescriptionLine = (description?: string | null) => {
    if (!description) return ''
    const trimmed = description.trim()
    if (trimmed.length <= 120) return trimmed
    return `${trimmed.slice(0, 120)}...`
  }

  if (loading) {
    return (
      <main>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading course overview...</p>
        </div>
      </main>
    )
  }

  if (!detail) {
    return (
      <main>
        <div className="no-results">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Course not found</h3>
          <p>The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
        </div>
      </main>
    )
  }

  const { course, modules } = detail

  return (
    <main>
      <section className="course-hero">
        <div className="course-hero-media">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} />
          ) : (
            <div className="course-hero-fallback"></div>
          )}
          <div className="course-hero-overlay"></div>
        </div>
        <div className="container">
          <div className="course-hero-content">
            <h1 className="course-hero-title">{course.title}</h1>
            <p className="course-hero-subtitle">Course overview</p>
            <div className="course-hero-meta">
              <span>
                <i className="fas fa-clock"></i> {formatDuration(course.duration)}
              </span>
              <span>
                <i className="fas fa-layer-group"></i> {course.moduleCount || 0} modules
              </span>
              {course.difficulty && (
                <span className={`recipe-difficulty difficulty-${course.difficulty.toLowerCase()}`}>
                  <i className="fas fa-signal"></i> {course.difficulty}
                </span>
              )}
              {course.category && (
                <span>
                  <i className="fas fa-tag"></i> {course.category}
                </span>
              )}
              <span>
                <i className="fas fa-calendar"></i> Updated {formatDate(course.updatedAt)}
              </span>
            </div>
            {course.rating !== null && course.rating !== undefined && (
              <div className="recipe-rating">
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <i
                      key={idx}
                      className={idx < Math.floor(course.rating || 0) ? 'fas fa-star' : 'far fa-star'}
                    />
                  ))}
                </div>
                <span className="rating-text">({(course.rating || 0).toFixed(1)})</span>
              </div>
            )}
            <p className="course-hero-description">
              {course.description || 'No description provided.'}
            </p>
            <div className="course-hero-price">
              <span className="current-price small">{formatPrice(course.price)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="recipes-section">
        <div className="container">

          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <h2 className="section-title">Modules & Lessons</h2>
            <p className="section-subtitle">Review modules and lesson updates</p>
          </div>

          {modules.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-folder-open"></i>
              <h3>No modules yet</h3>
              <p>This course does not have modules yet.</p>
            </div>
          ) : (
            <div className="course-modules">
              {modules.map((module) => {
                const isModuleOpen = !!expandedModules[module.id]
                const shortDescription = getDescriptionLine(module.description)

                return (
                  <div className="module-card" key={module.id}>
                    <button
                      className="module-toggle"
                      onClick={() =>
                        setExpandedModules((prev) => ({
                          ...prev,
                          [module.id]: !prev[module.id]
                        }))
                      }
                    >
                      <div>
                        <h3 className="module-title">{module.title}</h3>
                        <p className="module-subtitle">{shortDescription || 'No description provided.'}</p>
                      </div>
                      <span className="module-toggle-icon">
                        <i className={`fas fa-chevron-${isModuleOpen ? 'up' : 'down'}`}></i>
                      </span>
                    </button>

                    {isModuleOpen && (
                      <div className="module-body">
                        <div className="module-meta">
                          <span>
                            <i className="fas fa-calendar"></i> Updated {formatDate(module.updatedAt)}
                          </span>
                          <span>
                            <i className="fas fa-book"></i> {module.lessons.length} lessons
                          </span>
                        </div>

                        <div className="lesson-list">
                          {module.lessons.map((lesson) => (
                            <div className="lesson-item" key={lesson.id}>
                              <div>
                                <h4>{lesson.title}</h4>
                                <p>{lesson.description || 'No lesson description.'}</p>
                                <div className="lesson-meta">
                                  {lesson.contentType && (
                                    <span>
                                      <i className="fas fa-tag"></i> {lesson.contentType}
                                    </span>
                                  )}
                                  {lesson.durationMinutes && (
                                    <span>
                                      <i className="fas fa-clock"></i> {lesson.durationMinutes} min
                                    </span>
                                  )}
                                  <span>
                                    <i className="fas fa-calendar"></i> Updated {formatDate(lesson.updatedAt)}
                                  </span>
                                </div>
                              </div>
                              <button className="btn btn-outline btn-small" disabled>
                                Lesson on hold
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default CourseDetail
