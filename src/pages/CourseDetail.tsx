import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  fetchCourseOverviewDetail,
  fetchPurchasedCourseIds,
  fetchCourseReviews,
  saveCourseReview,
  updateCourseReview,
  deleteCourseReview,
  type CourseOverviewDetail,
  type CourseReview
} from '../services/courses'
import { addToCart } from '../services/cart'
import { getUserSession } from '../services/auth'

function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<CourseOverviewDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [ownsCourse, setOwnsCourse] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [reviews, setReviews] = useState<CourseReview[]>([])
  const [reviewSummary, setReviewSummary] = useState({ rating: 0, count: 0 })
  const [myReview, setMyReview] = useState<CourseReview | null>(null)
  const [canReview, setCanReview] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [savingReview, setSavingReview] = useState(false)
  const [deletingReview, setDeletingReview] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (!id) return
    window.scrollTo(0, 0)
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

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!detail?.course?.id || !getUserSession()) {
        if (!cancelled) setOwnsCourse(false)
        return
      }
      const ids = await fetchPurchasedCourseIds()
      if (!cancelled) {
        setOwnsCourse(ids.includes(detail.course.id))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [detail?.course.id])

  useEffect(() => {
    if (!detail?.course?.id) return
    let cancelled = false
    ;(async () => {
      try {
        const response = await fetchCourseReviews(detail.course.id)
        if (cancelled) return
        setReviews(response.reviews || [])
        setReviewSummary(response.summary || { rating: 0, count: 0 })
        setCanReview(Boolean(response.canReview))
        setMyReview(response.myReview || null)
        if (response.myReview) {
          setReviewRating(response.myReview.rating)
          setReviewComment(response.myReview.comment || '')
        } else {
          setReviewRating(5)
          setReviewComment('')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load course reviews', error)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [detail?.course?.id])

  const handleAddToCart = async () => {
    if (!detail?.course.id) return
    if (!getUserSession()) {
      navigate(`/login`)
      return
    }
    if (ownsCourse) return
    setAddingToCart(true)
    try {
      const result = await addToCart(detail.course.id)
      if (result.success || result.alreadyInCart) {
        window.dispatchEvent(new Event('cartChanged'))
        window.alert(result.alreadyInCart ? 'This course is already in your cart.' : 'Course added to cart.')
        return
      }
      window.alert(result.message || 'Could not add to cart.')
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Could not add to cart.')
    } finally {
      setAddingToCart(false)
    }
  }

  const refreshReviews = async () => {
    if (!detail?.course?.id) return
    const response = await fetchCourseReviews(detail.course.id)
    setReviews(response.reviews || [])
    setReviewSummary(response.summary || { rating: 0, count: 0 })
    setCanReview(Boolean(response.canReview))
    setMyReview(response.myReview || null)
    if (response.myReview) {
      setReviewRating(response.myReview.rating)
      setReviewComment(response.myReview.comment || '')
    } else {
      setReviewRating(5)
      setReviewComment('')
    }
  }

  const handleSaveReview = async () => {
    if (!detail?.course?.id) return
    try {
      setSavingReview(true)
      if (myReview) {
        await updateCourseReview(detail.course.id, reviewRating, reviewComment)
      } else {
        await saveCourseReview(detail.course.id, reviewRating, reviewComment)
      }
      await refreshReviews()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Failed to save review')
    } finally {
      setSavingReview(false)
    }
  }

  const handleDeleteReview = async () => {
    if (!detail?.course?.id || !myReview) return
    if (!window.confirm('Delete your review for this course?')) return
    try {
      setDeletingReview(true)
      await deleteCourseReview(detail.course.id)
      await refreshReviews()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Failed to delete review')
    } finally {
      setDeletingReview(false)
    }
  }

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
                <span className="course-hero-pill">
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
            <div className="recipe-rating course-hero-rating">
                <div className="stars">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <i
                      key={idx}
                    className={idx < Math.floor(reviewSummary.rating || course.rating || 0) ? 'fas fa-star' : 'far fa-star'}
                    />
                  ))}
                </div>
              <span className="rating-text">
                {(reviewSummary.rating || course.rating || 0).toFixed(1)} ({reviewSummary.count} reviews)
              </span>
              </div>
            <p className="course-hero-description">
              {course.description || 'No description provided.'}
            </p>
            {!ownsCourse && (
              <div className="course-hero-price">
                <span className="current-price small">{formatPrice(course.price)}</span>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              {ownsCourse ? (
                <Link to={`/courses/${course.id}/learn`} className="btn btn-primary">
                  Start learning
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={addingToCart}
                    onClick={handleAddToCart}
                  >
                    {addingToCart ? 'Adding…' : 'Add to cart'}
                  </button>
                  <Link to="/cart" className="btn btn-outline">
                    View cart
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="recipes-section">
        <div className="container">
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
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className={`module-card ${!canReview ? 'review-disabled' : ''}`} style={{ marginTop: '1rem' }}>
            <div className="module-body">
              <h3 className="review-section-title">Ratings & Reviews</h3>
              <p className="module-subtitle" style={{ marginBottom: '0.75rem' }}>
                Average {reviewSummary.rating.toFixed(1)} from {reviewSummary.count} review{reviewSummary.count !== 1 ? 's' : ''}.
              </p>

              <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Your Rating</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const star = idx + 1
                    return (
                      <button
                        key={star}
                        type="button"
                        className="btn btn-outline btn-small"
                        disabled={!canReview || savingReview || deletingReview}
                        onClick={() => setReviewRating(star)}
                        style={{ minWidth: '2.2rem', padding: '0.25rem 0.45rem', opacity: reviewRating >= star ? 1 : 0.55 }}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    )
                  })}
                </div>
                <label htmlFor="course-review-comment" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Your Comment</label>
                <textarea
                  id="course-review-comment"
                  className="form-control review-textarea"
                  rows={3}
                  placeholder={canReview ? 'Share your learning experience…' : 'Purchase this course to leave a review.'}
                  value={reviewComment}
                  disabled={!canReview || savingReview || deletingReview}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!canReview || savingReview || deletingReview}
                    onClick={handleSaveReview}
                  >
                    {savingReview ? 'Saving…' : (myReview ? 'Update Review' : 'Submit Review')}
                  </button>
                  {myReview && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      disabled={deletingReview || savingReview}
                      onClick={handleDeleteReview}
                    >
                      {deletingReview ? 'Deleting…' : 'Delete Review'}
                    </button>
                  )}
                </div>
              </div>

              <div className="lesson-list">
                {reviews.length === 0 ? (
                  <p className="module-subtitle" style={{ margin: 0 }}>No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div className="lesson-item" key={review.id}>
                      <h4>{review.username}</h4>
                      <div className="lesson-meta" style={{ marginBottom: '0.35rem' }}>
                        <span><i className="fas fa-star"></i> {review.rating}/5</span>
                        <span><i className="fas fa-calendar"></i> {formatDate(review.updatedAt)}</span>
                      </div>
                      <p>{review.comment || 'No comment provided.'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default CourseDetail
