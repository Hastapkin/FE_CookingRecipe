import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createRecipe, fetchRecipeById, updateRecipe } from '../../services/recipes'
import { getUserSession } from '../../services/auth'
import type { Recipe } from '../../types/recipe'

function sanitizeRecipeForEditing(recipe: Recipe): Record<string, unknown> {
  const {
    youtubeVideoId,
    isForSale,
    createdAt,
    rating,
    totalRatings,
    viewCount,
    purchaseCount,
    ...rest
  } = recipe

  return JSON.parse(JSON.stringify(rest)) as Record<string, unknown>
}

function AdminRecipeEditor() {
  const { id } = useParams<{ id: string }>()
  const recipeId = id ? Number(id) : null
  const isEdit = Boolean(recipeId)
  const navigate = useNavigate()

  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

    if (isEdit && recipeId) {
      const loadRecipe = async () => {
        try {
          setLoading(true)
          setError(null)
          const data = await fetchRecipeById(recipeId, true)
          if (!data) {
            setError('Recipe not found')
            return
          }
          const payload = sanitizeRecipeForEditing(data)
          setJsonInput(JSON.stringify(payload, null, 2))
        } catch (err) {
          console.error('Failed to load recipe', err)
          setError('Failed to load recipe. Please try again later.')
        } finally {
          setLoading(false)
        }
      }

      loadRecipe()
    } else {
      setJsonInput(`{
  "title": "",
  "description": "",
  "videoUrl": "",
  "price": 0,
  "difficulty": "easy",
  "cookingTime": 0,
  "servings": 1,
  "category": "",
  "ingredients": [],
  "instructions": [],
  "nutrition": []
}`)
    }
  }, [isAdmin, isEdit, navigate, recipeId, session?.user?.id])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!session) {
      navigate('/login')
      return
    }

    if (!isAdmin) {
      navigate('/')
      return
    }

    try {
      setSaving(true)
      setError(null)
      const parsed = JSON.parse(jsonInput)

      if (isEdit && recipeId) {
        await updateRecipe(recipeId, parsed)
        alert('Recipe updated successfully.')
      } else {
        await createRecipe(parsed)
        alert('Recipe created successfully.')
      }

      navigate('/admin/recipes')
    } catch (err) {
      console.error('Failed to save recipe', err)
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your input.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to save recipe. Please try again later.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <main className="admin-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{isEdit ? 'Edit Recipe' : 'Add New Recipe'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update the recipe JSON payload and save your changes.' : 'Paste or write the recipe JSON payload, then submit to create the recipe.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner large"></div>
              <p>Loading recipe data...</p>
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
                Recipe JSON
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
                  onClick={() => navigate('/admin/recipes')}
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
                      {isEdit ? ' Save Changes' : ' Create Recipe'}
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

export default AdminRecipeEditor
