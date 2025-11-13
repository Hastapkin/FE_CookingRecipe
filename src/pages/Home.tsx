// React import not required with react-jsx runtime
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { addToCart } from '../services/cart'
import { isAuthenticated, getUserSession } from '../services/auth'
import YouTubePlayer from '../components/YouTubePlayer'
import VideoPreview from '../components/VideoPreview'
import PriceButton from '../components/PriceButton'
import { fetchRecipes } from '../services/recipes'
import type { Recipe } from '../types/recipe'

function Home() {
  const navigate = useNavigate()
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    const session = getUserSession()
    if ((session?.user.role || '').toLowerCase() === 'admin') {
      navigate('/admin/recipes')
    }
  }, [navigate])

  useEffect(() => {
    loadFeaturedRecipes()
  }, [])

  const loadFeaturedRecipes = async () => {
    try {
      // Fetch most popular recipes (sorted by purchaseCount or viewCount)
      const result = await fetchRecipes({
        sortBy: 'popular',
        limit: 3,
        page: 1
      })
      if (result.recipes && result.recipes.length > 0) {
        setFeaturedRecipes(result.recipes.slice(0, 3))
      } else {
        // Fallback to sample data
        setFeaturedRecipes([
          {
            id: 1,
            title: "BÚN CHẢ",
            youtubeVideoId: "V37douhyx_0",
            price: 9.99,
            isForSale: true,
            difficulty: "Medium",
            cookingTime: 120,
            servings: 4,
            category: "Vietnamese",
            rating: 4.8,
            totalRatings: 156,
            viewCount: 156,
            purchaseCount: 0
          },
          {
            id: 2,
            title: "CƠM TẤM",
            youtubeVideoId: "P50LW8SzfXQ",
            price: 9.99,
            isForSale: true,
            difficulty: "Medium",
            cookingTime: 120,
            servings: 4,
            category: "Vietnamese",
            rating: 4.9,
            totalRatings: 320,
            viewCount: 320,
            purchaseCount: 0
          },
          {
            id: 3,
            title: "GIẢ CẦY",
            youtubeVideoId: "S-fBig2UEvA",
            price: 7.99,
            isForSale: true,
            difficulty: "Medium",
            cookingTime: 90,
            servings: 4,
            category: "Vietnamese",
            rating: 4.7,
            totalRatings: 210,
            viewCount: 210,
            purchaseCount: 0
          }
        ])
      }
    } catch (error) {
      console.error('Failed to load featured recipes:', error)
      // Fallback to sample data on error
      setFeaturedRecipes([
        {
          id: 1,
          title: "BÚN CHẢ",
          youtubeVideoId: "V37douhyx_0",
          price: 9.99,
          isForSale: true,
          difficulty: "Medium",
          cookingTime: 120,
          servings: 4,
          category: "Vietnamese",
          rating: 4.8,
          totalRatings: 156,
          viewCount: 156,
          purchaseCount: 0
        },
        {
          id: 2,
          title: "CƠM TẤM",
          youtubeVideoId: "P50LW8SzfXQ",
          price: 9.99,
          isForSale: true,
          difficulty: "Medium",
          cookingTime: 120,
          servings: 4,
          category: "Vietnamese",
          rating: 4.9,
          totalRatings: 320,
          viewCount: 320,
          purchaseCount: 0
        },
        {
          id: 3,
          title: "GIẢ CẦY",
          youtubeVideoId: "S-fBig2UEvA",
          price: 7.99,
          isForSale: true,
          difficulty: "Medium",
          cookingTime: 90,
          servings: 4,
          category: "Vietnamese",
          rating: 4.7,
          totalRatings: 210,
          viewCount: 210,
          purchaseCount: 0
        }
      ])
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-background"><div className="hero-pattern"></div></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Learn from <span className="gradient-text">Master</span></h1>
            <p className="hero-subtitle">Learn from professional chefs !</p>
            <div className="hero-buttons">
              <Link to="/recipes" className="btn btn-primary">
                <i className="fas fa-play"></i>
                Browse Video Recipes
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item"><div className="stat-number">50+</div><div className="stat-label">Video Recipes</div></div>
              <div className="stat-item"><div className="stat-number">4.8</div><div className="stat-label">Rating</div></div>
            </div>
          </div>
          <div className="hero-video">
            <div className="hero-video-container">
              <YouTubePlayer
                videoId="V37douhyx_0"
                width="932px"
                height="524px"
                autoplay={true}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="featured-recipes">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Video Recipes</h2>
            <p className="section-subtitle">Learn from the chef with step-by-step video tutorials</p>
          </div>
          <div className="recipes-grid">
            {featuredRecipes.map((recipe) => (
              <div className="recipe-card" key={recipe.id}>
                <div className="recipe-video">
                  <VideoPreview
                    videoId={recipe.youtubeVideoId}
                    thumbnail={recipe.videoThumbnail ?? undefined}
                    duration={`${Math.floor(recipe.cookingTime / 60)}:${(recipe.cookingTime % 60).toString().padStart(2, '0')}`}
                    height="200px"
                  />
                  <div className="recipe-badge">{recipe.category}</div>
                  <div className="recipe-overlay">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/recipe-detail/${recipe.id}`, { state: { recipe } });
                      }}
                      className="btn btn-small"
                    >
                      <i className="fas fa-play"></i> Watch Recipe
                    </button>
                  </div>
                </div>
                <div className="recipe-content">
                  <div className="recipe-header">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    <div className="recipe-rating">
                      <div className="stars">
                        {Array.from({length: 5}).map((_, idx) => (
                          <i 
                            key={idx} 
                            className={idx < Math.floor(recipe.rating) ? "fas fa-star" : "far fa-star"}
                          />
                        ))}
                      </div>
                      <span className="rating-text">({recipe.rating})</span>
                    </div>
                  </div>
                  <p className="recipe-description">
                    Professional {recipe.category.toLowerCase()} recipe with detailed video instructions
                  </p>
                  <div className="recipe-meta">
                    <span className="recipe-time">
                      <i className="fas fa-clock"></i> {Math.floor(recipe.cookingTime / 60)}h {recipe.cookingTime % 60}m
                    </span>
                    <span className={`recipe-difficulty difficulty-${recipe.difficulty.toLowerCase()}`}>
                      <i className="fas fa-signal"></i> {recipe.difficulty}
                    </span>
                    <span className="recipe-servings">
                      <i className="fas fa-users"></i> {recipe.servings} servings
                    </span>
                  </div>
                  <div className="recipe-footer">
                    <PriceButton
                      price={recipe.price}
                      isForSale={recipe.isForSale}
                      size="small"
                      onPurchase={async () => {
                        if (!isAuthenticated()) {
                          navigate('/login');
                          return;
                        }
                        try {
                          await addToCart(recipe.id);
                          // Stay on page to continue browsing
                        } catch (error) {
                          const errorMessage = error instanceof Error ? error.message : String(error);
                          // Check if item is already in cart
                          if (errorMessage.toLowerCase().includes('already') || 
                              errorMessage.toLowerCase().includes('duplicate') ||
                              errorMessage.toLowerCase().includes('exists')) {
                            alert('Item is already in cart');
                            navigate('/cart');
                          } else {
                            console.error('Failed to add to cart', error);
                            alert('Failed to add recipe to cart. Please try again.');
                          }
                        }
                      }}
                    />
                    <div className="recipe-stats">
                      <span className="view-count">
                        <i className="fas fa-eye"></i> {recipe.totalRatings} views
                      </span>
                    </div>
                  </div>
                </div>
              </div> 
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home

