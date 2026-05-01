import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { CourseOverview } from '../services/courses'
import { fetchCourses, fetchPurchasedCourseIds } from '../services/courses'
import { getUserSession } from '../services/auth'

function MyCourses() {
  const navigate = useNavigate()
  const [allCourses, setAllCourses] = useState<CourseOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    search: ''
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!getUserSession()) {
        navigate('/login')
        return
      }

      setLoading(true)
      try {
        const [allResult, ownedIds] = await Promise.all([
          fetchCourses({ page: 1, limit: 200, sortBy: 'newest' }),
          fetchPurchasedCourseIds()
        ])

        const ownedSet = new Set(ownedIds)
        const purchased = (allResult.courses || []).filter((course) => ownedSet.has(course.id))
        if (!cancelled) setAllCourses(purchased)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load purchased courses', e)
        if (!cancelled) setAllCourses([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters.search, filters.sortBy])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const formatDuration = (duration?: number | null) => {
    if (!duration || duration <= 0) return 'Self-paced'
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const searched = allCourses.filter((course) => {
    const q = filters.search.trim().toLowerCase()
    if (!q) return true
    return (
      (course.title || '').toLowerCase().includes(q) ||
      (course.description || '').toLowerCase().includes(q)
    )
  })

  const sorted = [...searched].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price':
        return a.price - b.price
      case 'rating':
        return b.rating - a.rating
      case 'popular':
        return b.moduleCount - a.moduleCount
      case 'newest':
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    }
  })

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const start = (safeCurrentPage - 1) * pageSize
  const paginatedCourses = sorted.slice(start, start + pageSize)

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">My Courses</h1>
          <p className="page-subtitle">Access all your purchased courses in one place</p>
        </div>
      </section>

      <section className="search-filter">
        <div className="container">
          <div className="search-bar">
            <div className="search-input-group">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search your purchased courses..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="filter-section">
            <div className="filter-group">
              <label>Sort by:</label>
              <select
                className="filter-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Modules</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="recipes-section">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your courses...</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h3>You own {total} course{total !== 1 ? 's' : ''}</h3>
              </div>

              {paginatedCourses.length === 0 ? (
                <div className="no-results">
                  <i className="fas fa-shopping-bag"></i>
                  <h3>No purchased courses found</h3>
                  <p>
                    {filters.search
                      ? 'Try adjusting your search terms'
                      : "You haven't purchased any courses yet."}
                  </p>
                  {!filters.search && (
                    <Link to="/courses" className="btn btn-primary">
                      Browse Courses
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="recipes-grid">
                    {paginatedCourses.map((course) => {
                      const difficultyLabel = course.difficulty || 'Beginner'
                      return (
                        <div
                          className="recipe-card"
                          key={course.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => navigate(`/courses/${course.id}`)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              navigate(`/courses/${course.id}`)
                            }
                          }}
                        >
                          <div className="recipe-video">
                            {course.thumbnail ? (
                              <img src={course.thumbnail} alt={course.title} />
                            ) : (
                              <div className="video-preview">
                                <div className="hover-overlay">
                                  <div className="play-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="recipe-badge">{difficultyLabel}</div>
                          </div>
                          <div className="recipe-content">
                            <div className="recipe-header">
                              <h3 className="recipe-title">{course.title}</h3>
                              <div className="recipe-rating">
                                <div className="stars">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <i
                                      key={idx}
                                      className={idx < Math.floor(course.rating) ? 'fas fa-star' : 'far fa-star'}
                                    />
                                  ))}
                                </div>
                                <span className="rating-text">({course.rating.toFixed(1)})</span>
                              </div>
                            </div>
                            <p className="recipe-description">
                              {course.description || 'A structured cooking course with guided lessons.'}
                            </p>
                            <div className="recipe-meta">
                              <span className="recipe-time">
                                <i className="fas fa-clock"></i> {formatDuration(course.duration)}
                              </span>
                              <span className="recipe-servings">
                                <i className="fas fa-layer-group"></i> {course.moduleCount} modules
                              </span>
                              <span className={`recipe-difficulty difficulty-${difficultyLabel.toLowerCase()}`}>
                                <i className="fas fa-signal"></i> {difficultyLabel}
                              </span>
                            </div>
                            <div className="recipe-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className="recipe-meta" style={{ margin: 0 }}>Purchased</span>
                              <Link
                                to={`/courses/${course.id}/learn`}
                                className="btn btn-primary btn-small"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Start learning
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-btn prev"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={safeCurrentPage === 1}
                      >
                        <i className="fas fa-chevron-left"></i> Previous
                      </button>
                      <div className="pagination-numbers">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                          <button
                            key={n}
                            className={`pagination-number ${n === safeCurrentPage ? 'active' : ''}`}
                            onClick={() => setCurrentPage(n)}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <button
                        className="pagination-btn next"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={safeCurrentPage === totalPages}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default MyCourses

