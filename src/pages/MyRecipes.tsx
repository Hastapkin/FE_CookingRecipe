// React import not required with react-jsx runtime
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import VideoPreview from '../components/VideoPreview'
import type { Recipe } from '../types/recipe'
import { fetchMyRecipes } from '../services/recipes'
import { isAuthenticated } from '../services/auth'

function MyRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
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
    category: '',
    difficulty: '',
    time: '',
    sortBy: 'newest',
    search: ''
  });

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        // Map frontend filters to API query params
        const apiParams: any = {};
        if (filters.search) apiParams.search = filters.search;
        if (filters.difficulty) {
          // Map frontend difficulty (Easy/Medium/Hard) to API format (easy/medium/hard)
          apiParams.difficulty = filters.difficulty.toLowerCase();
        }
        if (filters.time) {
          // Map frontend time filters to API format
          const time = parseInt(filters.time);
          if (time === 30) apiParams.cookingTime = '<30';
          else if (time === 60) apiParams.cookingTime = '30-60';
          else if (time === 120) apiParams.cookingTime = '60-120';
          else if (time === 121) apiParams.cookingTime = '>120';
        }
        if (filters.sortBy) {
          // Map frontend sort options to API format
          const sortMap: Record<string, string> = {
            'newest': 'newest',
            'popular': 'popular',
            'rating': 'rating',
            'price-low': 'price',
            'price-high': 'price'
          };
          apiParams.sortBy = sortMap[filters.sortBy] || 'newest';
        }
        apiParams.page = currentPage;
        apiParams.limit = pageSize;

        const result = await fetchMyRecipes(apiParams);
        if (!cancelled) {
          if (result.recipes && result.recipes.length > 0) {
            setRecipes(result.recipes);
            setPagination(result.pagination);
          } else {
            setRecipes([]);
            setPagination(result.pagination);
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load purchased recipes', e);
        if (!cancelled) {
          setRecipes([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [filters.search, filters.difficulty, filters.time, filters.sortBy, currentPage, navigate]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.difficulty, filters.time, filters.sortBy, filters.search]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Since API handles filtering and sorting, we just use recipes directly
  // But we still need client-side filtering for category (if not supported by API)
  const filteredRecipes = recipes.filter(recipe => {
    if (filters.category && recipe.category !== filters.category) return false;
    return true;
  });

  // Use API pagination data
  const totalPages = pagination.totalPages || 1;
  const paginatedRecipes = filteredRecipes; // API already paginates, but we filter category client-side

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">My Purchased Recipes</h1>
          <p className="page-subtitle">Access all your purchased video recipes</p>
        </div>
      </section>

      <section className="search-filter">
        <div className="container">
          <div className="search-bar">
            <div className="search-input-group">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search your purchased recipes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="filter-section">
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
              <p>Loading your purchased recipes...</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h3>You have {pagination.total || filteredRecipes.length} purchased recipe{pagination.total !== 1 ? 's' : ''}</h3>
              </div>
              
              {filteredRecipes.length === 0 ? (
                <div className="no-results">
                  <i className="fas fa-shopping-bag"></i>
                  <h3>No purchased recipes found</h3>
                  <p>
                    {filters.search || filters.difficulty || filters.time
                      ? "Try adjusting your filters or search terms"
                      : "You haven't purchased any recipes yet. Start exploring our video recipes!"
                    }
                  </p>
                  {!(filters.search || filters.difficulty || filters.time) && (
                    <Link to="/recipes" className="btn btn-primary">
                      Browse Recipes
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="recipes-grid">
                    {paginatedRecipes.map((recipe) => (
                      <div className="recipe-card" key={recipe.id}>
                        <div className="recipe-video">
                          <VideoPreview
                            videoId={recipe.youtubeVideoId}
                            thumbnail={recipe.videoThumbnail ?? undefined}
                            duration={`${Math.floor(recipe.cookingTime / 60)}:${(recipe.cookingTime % 60).toString().padStart(2, '0')}`}
                            height="200px"
                            onPlay={() => navigate(`/recipe-detail/${recipe.id}`, { state: { recipe } })}
                          />
                          <div className="recipe-badge">{recipe.category}</div>
                          <div className="recipe-overlay">
                            <Link to={`/recipe-detail/${recipe.id}`} state={{ recipe }} className="btn btn-small">
                              <i className="fas fa-play"></i> Watch Recipe
                            </Link>
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
                            <Link 
                              to={`/recipe-detail/${recipe.id}`}
                              className="btn btn-primary"
                              style={{width: '100%'}}
                            >
                              <i className="fas fa-play"></i> Watch Recipe
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
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

export default MyRecipes

