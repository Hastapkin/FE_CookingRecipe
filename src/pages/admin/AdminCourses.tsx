import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CourseOverview } from '../../services/courses'
import { fetchCourses } from '../../services/courses'

function AdminCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<CourseOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchCourses({ limit: 200, sortBy: 'newest' })
        setCourses(response.courses)
      } catch (err) {
        console.error('Failed to load courses', err)
        setError('Failed to load courses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [navigate])

  const filteredCourses = useMemo<CourseOverview[]>(() => {
    if (!search.trim()) return courses
    const term = search.toLowerCase()
    return courses.filter((course) =>
      course.title.toLowerCase().includes(term) ||
      (course.description || '').toLowerCase().includes(term)
    )
  }, [courses, search])

  return (
    <main className="admin-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Manage Courses</h1>
          <p className="page-subtitle">View and maintain all courses in the system</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-recipes-toolbar">
            <input
              type="search"
              className="form-control"
              placeholder="Search by course title or description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => navigate('/admin/courses/new')}
            >
              <i className="fas fa-plus-circle"></i>
              Add Course
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner large"></div>
              <p>Loading courses...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-book-open"></i>
              <h3>No courses found</h3>
              <p>Try adjusting your search term or add a new course.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/admin/courses/new')}
              >
                Add Course
              </button>
            </div>
          ) : (
            <div className="admin-recipes-table">
              <div className="table-header">
                <span>Title</span>
                <span>Modules</span>
                <span>Difficulty</span>
                <span>Price</span>
                <span>Actions</span>
              </div>
              {filteredCourses.map((course) => (
                <div key={course.id} className="table-row">
                  <span>{course.title}</span>
                  <span>{course.moduleCount || 0}</span>
                  <span>{course.difficulty || '—'}</span>
                  <span>${course.price?.toFixed(2) ?? '0.00'}</span>
                  <span>
                    <button
                      className="btn btn-outline btn-small"
                      onClick={() => navigate(`/admin/courses/${course.id}`)}
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default AdminCourses
