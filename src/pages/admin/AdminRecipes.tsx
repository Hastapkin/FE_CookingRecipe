import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Recipe } from '../../types/recipe'
import { fetchRecipes } from '../../services/recipes'
import { getUserSession } from '../../services/auth'

function AdminRecipes() {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const session = getUserSession()
  const isAdmin = (session?.user.role || '').toLowerCase() === 'admin'

  useEffect(() => {
    if (!session) {
      navigate('/login')
      return
    }

    if (!isAdmin) {
      navigate('/')
      return
    }

    const loadRecipes = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchRecipes({ limit: 100 }, { requireAuth: true })
        setRecipes(response.recipes)
      } catch (err) {
        console.error('Failed to load recipes', err)
        setError('Failed to load recipes. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [isAdmin, navigate, session?.user?.id])

  const filteredRecipes = useMemo<Recipe[]>(() => {
    if (!search.trim()) return recipes
    const term = search.toLowerCase()
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(term) ||
      (recipe.category || '').toLowerCase().includes(term) ||
      (recipe.description || '').toLowerCase().includes(term)
    )
  }, [recipes, search])

  if (!isAdmin) {
    return null
  }

  return (
    <main className="admin-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Manage Recipes</h1>
          <p className="page-subtitle">View and maintain all recipes in the system</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-recipes-toolbar">
            <input
              type="search"
              className="form-control"
              placeholder="Search by title, category, or description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => navigate('/admin/recipes/new')}
            >
              <i className="fas fa-plus-circle"></i>
              Add Recipe
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner large"></div>
              <p>Loading recipes...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-utensils"></i>
              <h3>No recipes found</h3>
              <p>Try adjusting your search term or add a new recipe.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/admin/recipes/new')}
              >
                Add Recipe
              </button>
            </div>
          ) : (
            <div className="admin-recipes-table">
              <div className="table-header">
                <span>Title</span>
                <span>Category</span>
                <span>Difficulty</span>
                <span>Price</span>
                <span>Actions</span>
              </div>
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="table-row">
                  <span>{recipe.title}</span>
                  <span>{recipe.category || '—'}</span>
                  <span>{recipe.difficulty || '—'}</span>
                  <span>${recipe.price?.toFixed(2) ?? '0.00'}</span>
                  <span>
                    <button
                      className="btn btn-outline btn-small"
                      onClick={() => navigate(`/admin/recipes/${recipe.id}`)}
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

export default AdminRecipes
