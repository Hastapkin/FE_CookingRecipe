import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import YouTubePlayer from '../components/YouTubePlayer'
import PriceButton from '../components/PriceButton'
import type { Recipe } from '../types/recipe'
import { fetchRecipeById } from '../services/recipes'

function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition' | 'reviews'>('ingredients');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!id) return;
        const data = await fetchRecipeById(Number(id));
        if (!cancelled) setRecipe(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load recipe', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [id]);

  const handlePurchase = () => {
    console.log('Purchasing recipe:', recipe?.id);
    // Implement purchase logic here
  };

  const handleViewPurchased = () => {
    console.log('Viewing purchased recipe:', recipe?.id);
    // Navigate to full recipe content
  };

  if (loading) {
    return (
      <main>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading recipe details...</p>
        </div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main>
        <div className="no-results">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Recipe not found</h3>
          <p>The recipe you're looking for doesn't exist.</p>
          <Link to="/recipes" className="btn btn-primary">Browse Recipes</Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="recipe-detail">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <Link to="/recipes">Recipes</Link>
            <span className="separator">/</span>
            <span className="current">{recipe.title}</span>
          </nav>

          <div className="recipe-content">
            <div className="recipe-header">
              <div className="recipe-video-section">
                <YouTubePlayer
                  videoId={recipe.youtubeVideoId}
                  title={recipe.title}
                  width="100%"
                  height="400px"
                  autoplay={false}
                />
                <div className="recipe-badge">{recipe.category}</div>
                <div className="recipe-actions">
                  <button className="action-btn favorite" title="Add to favorites">
                    <i className="far fa-heart"></i>
                  </button>
                  <button className="action-btn share" title="Share recipe">
                    <i className="fas fa-share-alt"></i>
                  </button>
                  <button className="action-btn fullscreen" title="Fullscreen">
                    <i className="fas fa-expand"></i>
                  </button>
                </div>
              </div>
              <div className="recipe-info">
                <h1 className="recipe-title">{recipe.title}</h1>
                <p className="recipe-description">{recipe.description}</p>
                
                <div className="recipe-meta">
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>{Math.floor(recipe.cookingTime / 60)}h {recipe.cookingTime % 60}m</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-users"></i>
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-signal"></i>
                    <span>{recipe.difficulty}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-star"></i>
                    <span>{recipe.rating}/5 ({recipe.totalRatings} reviews)</span>
                  </div>
                </div>

                <div className="recipe-stats">
                  <div className="stat-item">
                    <i className="fas fa-eye"></i>
                    <span>{recipe.viewCount.toLocaleString()} views</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-shopping-cart"></i>
                    <span>{recipe.purchaseCount} sold</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-user"></i>
                    <span>by {recipe.createdBy}</span>
                  </div>
                </div>

                <div className="recipe-tags">
                  {(recipe.tags || []).map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="recipe-price-section">
                  <PriceButton
                    price={recipe.price}
                    isForSale={recipe.isForSale}
                    isPurchased={isPurchased}
                    size="large"
                    onPurchase={handlePurchase}
                    onViewPurchased={handleViewPurchased}
                  />
                </div>
              </div>
            </div>

            <div className="recipe-tabs">
              {(['ingredients','instructions','nutrition','reviews'] as const).map(tab => (
                <button key={tab} className={`tab-btn ${activeTab===tab? 'active':''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'ingredients' && <i className="fas fa-list"></i>}
                  {tab === 'instructions' && <i className="fas fa-clipboard-list"></i>}
                  {tab === 'nutrition' && <i className="fas fa-chart-pie"></i>}
                  {tab === 'reviews' && <i className="fas fa-comments"></i>}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'ingredients' && (
                <div className="ingredients-section">
                  <h3>Ingredients</h3>
                  <div className="ingredients-grid">
                    {(recipe.ingredients || []).map((ingredient, index) => (
                      <div key={index} className="ingredient-item">
                        <span className="ingredient-name">{ingredient.label}</span>
                        <span className="ingredient-amount">
                          {ingredient.quantity} {ingredient.measurement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'instructions' && (
                <div className="instructions-section">
                  <h3>Step-by-Step Instructions</h3>
                  <div className="instructions-list">
                    {(recipe.instructions || []).map((instruction, index) => (
                      <div key={index} className="instruction-item">
                        <div className="instruction-number">{instruction.step}</div>
                        <div className="instruction-content">{instruction.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div className="nutrition-section">
                  <h3>Nutrition Information</h3>
                  <div className="nutrition-grid">
                    <div className="nutrition-item">
                      <span className="nutrition-label">Calories</span>
                      <span className="nutrition-value">450</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Protein</span>
                      <span className="nutrition-value">25g</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Carbs</span>
                      <span className="nutrition-value">35g</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Fat</span>
                      <span className="nutrition-value">18g</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Fiber</span>
                      <span className="nutrition-value">3g</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Sodium</span>
                      <span className="nutrition-value">1200mg</span>
                    </div>
                  </div>
                  <p className="nutrition-note">*Nutrition information is per serving</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-section">
                  <div className="reviews-header">
                    <h3>Customer Reviews</h3>
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <span className="rating-number">{recipe.rating}</span>
                        <div className="rating-stars">
                          {Array.from({length: 5}).map((_, idx) => (
                            <i 
                              key={idx} 
                              className={idx < Math.floor(recipe.rating) ? "fas fa-star" : "far fa-star"}
                            />
                          ))}
                        </div>
                        <span className="rating-count">({recipe.totalRatings} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="reviews-list">
                    <div className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div className="reviewer-details">
                            <span className="reviewer-name">John Doe</span>
                            <div className="review-rating">
                              {Array.from({length: 5}).map((_, idx) => (
                                <i key={idx} className="fas fa-star"></i>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="review-date">2 days ago</span>
                      </div>
                      <p className="review-text">Amazing recipe! The video instructions were so clear and the broth was incredibly flavorful. Worth every penny!</p>
                    </div>
                    <div className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div className="reviewer-details">
                            <span className="reviewer-name">Jane Smith</span>
                            <div className="review-rating">
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="far fa-star"></i>
                            </div>
                          </div>
                        </div>
                        <span className="review-date">1 week ago</span>
                      </div>
                      <p className="review-text">Great recipe! The video made it easy to follow along. Took longer than expected but the result was fantastic.</p>
                    </div>
                    <div className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div className="reviewer-details">
                            <span className="reviewer-name">Mike Chen</span>
                            <div className="review-rating">
                              {Array.from({length: 5}).map((_, idx) => (
                                <i key={idx} className="fas fa-star"></i>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="review-date">2 weeks ago</span>
                      </div>
                      <p className="review-text">Perfect! As someone who's never made pho before, the step-by-step video was incredibly helpful. Restaurant quality at home!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RecipeDetail

