// React import not required with react-jsx runtime
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CourseOverview } from '../services/courses'
import { fetchCourses } from '../services/courses'

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1
  });
  const pageSize = 9;
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    search: ''
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const apiParams: any = {};
        if (filters.search) apiParams.search = filters.search;
        if (filters.sortBy) {
          apiParams.sortBy = filters.sortBy;
        }
        apiParams.page = currentPage;
        apiParams.limit = pageSize;

        const result = await fetchCourses(apiParams);
        if (!cancelled) {
          if (result.courses && result.courses.length > 0) {
            setCourses(result.courses);
            setPagination(result.pagination);
          } else {
            setCourses([]);
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load courses', e);
        if (!cancelled) setCourses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [filters.search, filters.sortBy, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.sortBy, filters.search]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const totalPages = pagination.totalPages || 1;
  const paginatedCourses = courses;

  const formatDuration = (duration?: number | null) => {
    if (!duration || duration <= 0) return 'Self-paced';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">Explore structured cooking courses with lessons and assignments</p>
        </div>
      </section>

      <section className="search-filter">
        <div className="container">
          <div className="search-bar">
            <div className="search-input-group">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search courses..."
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
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
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
              <p>Loading courses...</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h3>Found {pagination.total || courses.length} courses</h3>
              </div>
              
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
                      <div className="recipe-footer">
                        <div className="price-display">
                          <span className="current-price small">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(course.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>

              {paginatedCourses.length === 0 && (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <h3>No courses found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              )}

              <div className="pagination">
                <button 
                  className="pagination-btn prev" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button 
                      key={n} 
                      className={`pagination-number ${n===currentPage? 'active':''}`}
                      onClick={() => setCurrentPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button 
                  className="pagination-btn next"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default Courses

