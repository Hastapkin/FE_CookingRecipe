// React import not required with react-jsx runtime
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import VideoPreview from '../components/VideoPreview'
import PriceButton from '../components/PriceButton'
import type { Recipe } from '../types/recipe'
import { fetchRecipes } from '../services/recipes'

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    time: '',
    sortBy: 'newest',
    search: ''
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchRecipes();
        if (!cancelled) {
          setRecipes(data);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load recipes', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (filters.category && recipe.category !== filters.category) return false;
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false;
    if (filters.time) {
      const time = parseInt(filters.time);
      if (time === 30 && recipe.cookingTime > 30) return false;
      if (time === 60 && (recipe.cookingTime <= 30 || recipe.cookingTime > 60)) return false;
      if (time === 120 && (recipe.cookingTime <= 60 || recipe.cookingTime > 120)) return false;
      if (time === 121 && recipe.cookingTime <= 120) return false;
    }
    if (filters.search && !recipe.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (filters.sortBy) {
      case 'popular':
        return b.purchaseCount - a.purchaseCount;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Video Recipe Collection</h1>
          <p className="page-subtitle">Learn cooking from professional chefs with step-by-step video tutorials</p>
        </div>
      </section>

      <section className="search-filter">
        <div className="container">
          <div className="search-bar">
            <div className="search-input-group">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search video recipes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="filter-section">
            <div className="filter-group">
              <label>Category:</label>
              <select 
                className="filter-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="Japanese">Japanese</option>
                <option value="Italian">Italian</option>
                <option value="Thai">Thai</option>
                <option value="French">French</option>
                <option value="Mexican">Mexican</option>
                <option value="Chinese">Chinese</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Difficulty:</label>
              <select 
                className="filter-select"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Cooking Time:</label>
              <select 
                className="filter-select"
                value={filters.time}
                onChange={(e) => handleFilterChange('time', e.target.value)}
              >
                <option value="">Any Time</option>
                <option value="30">Under 30 min</option>
                <option value="60">30-60 min</option>
                <option value="120">1-2 hours</option>
                <option value="121">Over 2 hours</option>
              </select>
            </div>
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
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
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
              <p>Loading video recipes...</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h3>Found {sortedRecipes.length} video recipes</h3>
                <div className="view-options">
                  <button className="view-btn active" data-view="grid">
                    <i className="fas fa-th"></i>
                  </button>
                  <button className="view-btn" data-view="list">
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
              
              <div className="recipes-grid">
                {sortedRecipes.map((recipe) => (
                  <div className="recipe-card" key={recipe.id}>
                    <div className="recipe-video">
                      <VideoPreview
                        videoId={recipe.youtubeVideoId}
                        thumbnail={recipe.videoThumbnail ?? undefined}
                        title={recipe.title}
                        duration={`${Math.floor(recipe.cookingTime / 60)}:${(recipe.cookingTime % 60).toString().padStart(2, '0')}`}
                        height="200px"
                        onPlay={() => console.log('Playing video:', recipe.id)}
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
                      <p className="recipe-description">{recipe.description}</p>
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
                      <div className="recipe-stats">
                        <span className="view-count">
                          <i className="fas fa-eye"></i> {recipe.viewCount.toLocaleString()} views
                        </span>
                        <span className="purchase-count">
                          <i className="fas fa-shopping-cart"></i> {recipe.purchaseCount} sold
                        </span>
                      </div>
                      <div className="recipe-footer">
                        <PriceButton
                          price={recipe.price}
                          isForSale={recipe.isForSale}
                          size="small"
                          onPurchase={() => console.log('Purchase recipe:', recipe.id)}
                        />
                        <div className="recipe-author">
                          <span className="author-name">by {recipe.createdBy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {sortedRecipes.length === 0 && (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <h3>No recipes found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              )}

              <div className="pagination">
                <button className="pagination-btn prev" disabled>
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                <div className="pagination-numbers">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} className={`pagination-number ${n===1? 'active':''}`}>
                      {n}
                    </button>
                  ))}
                </div>
                <button className="pagination-btn next">
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

export default Recipes

