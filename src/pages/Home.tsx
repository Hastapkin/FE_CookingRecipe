// React import not required with react-jsx runtime
import { Link } from 'react-router-dom'
import YouTubePlayer from '../components/YouTubePlayer'
import VideoPreview from '../components/VideoPreview'
import PriceButton from '../components/PriceButton'

function Home() {
  // Sample featured recipes with YouTube videos
  const featuredRecipes = [
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
      totalRatings: 156
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
      totalRatings: 320
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
      totalRatings: 210
    },
    {
      id: 4,
      title: "ẾCH ĐỒNG NƯỚNG NGHỆ",
      youtubeVideoId: "4BvbfoMT4SA",
      price: 4.99,
      isForSale: true,
      difficulty: "Easy",
      cookingTime: 30,
      servings: 4,
      category: "Vietnamese",
      rating: 4.6,
      totalRatings: 145
    },
    {
      id: 5,
      title: "XỐT CHẤM HẢI SẢN VÀ THỊT NƯỚNG",
      youtubeVideoId: "LU6nK8Kn-tE",
      price: 2.99,
      isForSale: true,
      difficulty: "Easy",
      cookingTime: 20,
      servings: 4,
      category: "Vietnamese",
      rating: 4.5,
      totalRatings: 98
    },
    {
      id: 6,
      title: "GIÒ HEO CHIÊN MẮM GIÒN TAN",
      youtubeVideoId: "eV9U9CVCGlI",
      price: 12.99,
      isForSale: true,
      difficulty: "Hard",
      cookingTime: 180,
      servings: 4,
      category: "Vietnamese",
      rating: 4.7,
      totalRatings: 180
    },
    {
      id: 7,
      title: "PHỞ BÒ",
      youtubeVideoId: "6YlPZWMjQCE",
      price: 19.99,
      isForSale: true,
      difficulty: "Hard",
      cookingTime: 300,
      servings: 4,
      category: "Vietnamese",
      rating: 4.8,
      totalRatings: 540
    },
    {
      id: 8,
      title: "MIẾN LƯƠNG",
      youtubeVideoId: "86oXUJNszjQ",
      price: 7.99,
      isForSale: true,
      difficulty: "Medium",
      cookingTime: 90,
      servings: 4,
      category: "Vietnamese",
      rating: 4.6,
      totalRatings: 260
    },
    {
      id: 9,
      title: "NEM THÍNH",
      youtubeVideoId: "CpsqnvGzC-w",
      price: 4.99,
      isForSale: true,
      difficulty: "Medium",
      cookingTime: 90,
      servings: 4,
      category: "Vietnamese",
      rating: 5.0,
      totalRatings: 100
    }
  ];

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
                    duration={`${Math.floor(recipe.cookingTime / 60)}:${(recipe.cookingTime % 60).toString().padStart(2, '0')}`}
                    height="200px"
                  />
                  <div className="recipe-badge">{recipe.category}</div>
                  <div className="recipe-overlay">
                    <Link to={`/recipe-detail/${recipe.id}`} className="btn btn-small">
                      <i className="fas fa-play"></i> Watch Recipe
                    </Link>
                  </div>
                  <div className="recipe-actions">
                    <button className="action-btn favorite-btn" data-tooltip="Add to favorites">
                      <i className="far fa-heart"></i>
                    </button>
                    <button className="action-btn share-btn" data-tooltip="Share">
                      <i className="fas fa-share-alt"></i>
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
                      onPurchase={() => console.log('Purchase recipe:', recipe.id)}
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

