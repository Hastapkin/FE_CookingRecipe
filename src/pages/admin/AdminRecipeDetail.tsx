import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Recipe } from '../../types/recipe'
import { deleteRecipe, fetchRecipeById, uploadRecipeThumbnail } from '../../services/recipes'
import { getUserSession } from '../../services/auth'
import YouTubePlayer from '../../components/YouTubePlayer'

function AdminRecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const recipeId = id ? Number(id) : null
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)

  const session = getUserSession()
  const isAdmin = (session?.user.role || '').toLowerCase() === 'admin'

  useEffect(() => {
    if (!session) {
      navigate('/login')
      return
    }

    if (!isAdmin || !recipeId) {
      navigate('/')
      return
    }

    const loadRecipe = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchRecipeById(recipeId, true)
        if (!data) {
          setError('Recipe not found')
        }
        setRecipe(data)
      } catch (err) {
        console.error('Failed to load recipe', err)
        setError('Failed to load recipe details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadRecipe()
  }, [isAdmin, navigate, recipeId, session?.user?.id])

  const handleDelete = async () => {
    if (!recipeId) return
    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteRecipe(recipeId)
      alert('Recipe deleted successfully.')
      navigate('/admin/recipes')
    } catch (err) {
      console.error('Failed to delete recipe', err)
      alert(err instanceof Error ? err.message : 'Failed to delete recipe. Please try again later.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!recipeId) return
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setThumbnailUploading(true)
      const updated = await uploadRecipeThumbnail(recipeId, file)
      setRecipe(updated)
      alert('Thumbnail updated successfully.')
    } catch (err) {
      console.error('Failed to update thumbnail', err)
      alert(err instanceof Error ? err.message : 'Failed to update thumbnail. Please try again later.')
    } finally {
      setThumbnailUploading(false)
      event.target.value = ''
    }
  }

  if (!isAdmin) {
    return null
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="loading-container" style={{ padding: '4rem 0' }}>
          <div className="loading-spinner large"></div>
          <p>Loading recipe...</p>
        </div>
      </main>
    )
  }

  if (error || !recipe) {
    return (
      <main className="admin-page">
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">Recipe Detail</h1>
            <p className="page-subtitle">Manage recipe information</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error || 'Recipe not found.'}</p>
              <button className="btn btn-outline" onClick={() => navigate('/admin/recipes')}>
                Back to recipes
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{recipe.title}</h1>
          <p className="page-subtitle">Manage recipe content and assets</p>
          <div className="page-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/admin/recipes/${recipe.id}/edit`)}
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
              onClick={() => navigate('/admin/recipes')}
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
              <YouTubePlayer
                videoId={recipe.youtubeVideoId}
                thumbnail={recipe.videoThumbnail ?? undefined}
                title={recipe.title}
                width="100%"
                height="400px"
              />
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
                        <span>Change Thumbnail</span>
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
                  <p>{recipe.category || '—'}</p>
                </div>
                <div>
                  <h4>Difficulty</h4>
                  <p>{recipe.difficulty || '—'}</p>
                </div>
                <div>
                  <h4>Cooking Time</h4>
                  <p>{recipe.cookingTime ? `${recipe.cookingTime} min` : '—'}</p>
                </div>
                <div>
                  <h4>Servings</h4>
                  <p>{recipe.servings || '—'}</p>
                </div>
                <div>
                  <h4>Price</h4>
                  <p>${recipe.price?.toFixed(2) ?? '0.00'}</p>
                </div>
                <div>
                  <h4>Video URL</h4>
                  <p>
                    {recipe.videoUrl ? (
                      <a href={recipe.videoUrl} target="_blank" rel="noopener noreferrer">
                        {recipe.videoUrl}
                      </a>
                    ) : '—'}
                  </p>
                </div>
              </div>

              <div className="admin-recipe-description">
                <h3>Description</h3>
                <p>{recipe.description || 'No description provided.'}</p>
              </div>

              <div className="admin-recipe-section">
                <h3>Ingredients</h3>
                <ul>
                  {(recipe.ingredients || []).map((item, index) => (
                    <li key={index}>
                      <strong>{item.label}</strong>
                      {item.quantity !== undefined && item.quantity !== null && ` - ${item.quantity}`}
                      {item.measurement && ` ${item.measurement}`}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="admin-recipe-section">
                <h3>Instructions</h3>
                <ol>
                  {(recipe.instructions || []).map((step, index) => (
                    <li key={index}>
                      <strong>Step {step.step ?? index + 1}:</strong> {step.content}
                    </li>
                  ))}
                </ol>
              </div>

              {recipe.nutrition && recipe.nutrition.length > 0 && (
                <div className="admin-recipe-section">
                  <h3>Nutrition</h3>
                  <ul>
                    {recipe.nutrition.map((item, index) => (
                      <li key={index}>
                        <strong>{item.type}:</strong> {item.quantity} {item.measurement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminRecipeDetail
