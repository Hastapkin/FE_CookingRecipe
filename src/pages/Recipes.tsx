// React import not required with react-jsx runtime
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import VideoPreview from '../components/VideoPreview'
import PriceButton from '../components/PriceButton'
import type { Recipe } from '../types/recipe'
import { fetchRecipes } from '../services/recipes'
import { addToCart } from '../services/cart'
import { isAuthenticated } from '../services/auth'

function Recipes() {
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

        const result = await fetchRecipes(apiParams);
        if (!cancelled) {
          if (result.recipes && result.recipes.length > 0) {
            setRecipes(result.recipes);
            setPagination(result.pagination);
          } else {
            // Fallback to static featured samples (dev FE seed)
            const featured: Recipe[] = [
              { id: 1, title: 'BÚN CHẢ', youtubeVideoId: 'V37douhyx_0', videoThumbnail: 'https://img.youtube.com/vi/V37douhyx_0/maxresdefault.jpg', price: 9.99, isForSale: true, difficulty: 'Medium', cookingTime: 120, servings: 4, category: 'Vietnamese', rating: 4.8, totalRatings: 156, viewCount: 156, purchaseCount: 0, description: 'Traditional Vietnamese grilled pork with vermicelli and herbs' },
              { id: 2, title: 'CƠM TẤM', youtubeVideoId: 'P50LW8SzfXQ', videoThumbnail: 'https://img.youtube.com/vi/P50LW8SzfXQ/maxresdefault.jpg', price: 9.99, isForSale: true, difficulty: 'Medium', cookingTime: 120, servings: 4, category: 'Vietnamese', rating: 4.9, totalRatings: 320, viewCount: 320, purchaseCount: 0, description: 'Classic broken rice with grilled pork chop and accompaniments' },
              { id: 3, title: 'GIẢ CẦY', youtubeVideoId: 'S-fBig2UEvA', videoThumbnail: 'https://img.youtube.com/vi/S-fBig2UEvA/maxresdefault.jpg', price: 7.99, isForSale: true, difficulty: 'Medium', cookingTime: 90, servings: 4, category: 'Vietnamese', rating: 4.7, totalRatings: 210, viewCount: 210, purchaseCount: 0, description: 'Vietnamese-style mock dog stew with aromatic spices' },
              { id: 4, title: 'ẾCH ĐỒNG NƯỚNG NGHỆ', youtubeVideoId: '4BvbfoMT4SA', videoThumbnail: 'https://img.youtube.com/vi/4BvbfoMT4SA/maxresdefault.jpg', price: 4.99, isForSale: true, difficulty: 'Easy', cookingTime: 30, servings: 4, category: 'Vietnamese', rating: 4.6, totalRatings: 145, viewCount: 145, purchaseCount: 0, description: 'Grilled field frog with turmeric, a rustic Vietnamese specialty' },
              { id: 5, title: 'XỐT CHẤM HẢI SẢN VÀ THỊT NƯỚNG', youtubeVideoId: 'LU6nK8Kn-tE', videoThumbnail: 'https://img.youtube.com/vi/LU6nK8Kn-tE/maxresdefault.jpg', price: 2.99, isForSale: true, difficulty: 'Easy', cookingTime: 20, servings: 4, category: 'Vietnamese', rating: 4.5, totalRatings: 98, viewCount: 98, purchaseCount: 0, description: 'Signature Vietnamese dipping sauce for seafood and BBQ' },
              { id: 6, title: 'GIÒ HEO CHIÊN MẮM GIÒN TAN', youtubeVideoId: 'eV9U9CVCGlI', videoThumbnail: 'https://img.youtube.com/vi/eV9U9CVCGlI/maxresdefault.jpg', price: 12.99, isForSale: true, difficulty: 'Hard', cookingTime: 180, servings: 4, category: 'Vietnamese', rating: 4.7, totalRatings: 180, viewCount: 180, purchaseCount: 0, description: 'Crispy deep-fried pork knuckle glazed with fish sauce' },
              { id: 7, title: 'PHỞ BÒ', youtubeVideoId: '6YlPZWMjQCE', videoThumbnail: 'https://img.youtube.com/vi/6YlPZWMjQCE/maxresdefault.jpg', price: 19.99, isForSale: true, difficulty: 'Hard', cookingTime: 300, servings: 4, category: 'Vietnamese', rating: 4.8, totalRatings: 540, viewCount: 540, purchaseCount: 0, description: 'Iconic Vietnamese beef noodle soup with aromatic broth' },
              { id: 8, title: 'MIẾN LƯƠNG', youtubeVideoId: '86oXUJNszjQ', videoThumbnail: 'https://img.youtube.com/vi/86oXUJNszjQ/maxresdefault.jpg', price: 7.99, isForSale: true, difficulty: 'Medium', cookingTime: 90, servings: 4, category: 'Vietnamese', rating: 4.6, totalRatings: 260, viewCount: 260, purchaseCount: 0, description: 'Vietnamese eel glass noodle soup, rich and flavorful' },
              { id: 9, title: 'NEM THÍNH', youtubeVideoId: 'CpsqnvGzC-w', videoThumbnail: 'https://img.youtube.com/vi/CpsqnvGzC-w/maxresdefault.jpg', price: 4.99, isForSale: true, difficulty: 'Medium', cookingTime: 90, servings: 4, category: 'Vietnamese', rating: 5.0, totalRatings: 100, viewCount: 100, purchaseCount: 0, description: 'Fermented pork roll with toasted rice powder and herbs' },
            ];
            setRecipes(featured);
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load recipes', e);
        // Fallback on error
        const featured: Recipe[] = [
          { id: 1, title: 'BÚN CHẢ', youtubeVideoId: 'V37douhyx_0', videoThumbnail: 'https://img.youtube.com/vi/V37douhyx_0/maxresdefault.jpg', price: 9.99, isForSale: true, difficulty: 'Medium', cookingTime: 120, servings: 4, category: 'Vietnamese', rating: 4.8, totalRatings: 156, viewCount: 156, purchaseCount: 0, description: 'Traditional Vietnamese grilled pork with vermicelli and herbs' },
          { id: 2, title: 'CƠM TẤM', youtubeVideoId: 'P50LW8SzfXQ', videoThumbnail: 'https://img.youtube.com/vi/P50LW8SzfXQ/maxresdefault.jpg', price: 9.99, isForSale: true, difficulty: 'Medium', cookingTime: 120, servings: 4, category: 'Vietnamese', rating: 4.9, totalRatings: 320, viewCount: 320, purchaseCount: 0, description: 'Classic broken rice with grilled pork chop and accompaniments' },
          { id: 3, title: 'GIẢ CẦY', youtubeVideoId: 'S-fBig2UEvA', videoThumbnail: 'https://img.youtube.com/vi/S-fBig2UEvA/maxresdefault.jpg', price: 7.99, isForSale: true, difficulty: 'Medium', cookingTime: 90, servings: 4, category: 'Vietnamese', rating: 4.7, totalRatings: 210, viewCount: 210, purchaseCount: 0, description: 'Vietnamese-style mock dog stew with aromatic spices' },
          { id: 4, title: 'ẾCH ĐỒNG NƯỚNG NGHỆ', youtubeVideoId: '4BvbfoMT4SA', videoThumbnail: 'https://img.youtube.com/vi/4BvbfoMT4SA/maxresdefault.jpg', price: 4.99, isForSale: true, difficulty: 'Easy', cookingTime: 30, servings: 4, category: 'Vietnamese', rating: 4.6, totalRatings: 145, viewCount: 145, purchaseCount: 0, description: 'Grilled field frog with turmeric, a rustic Vietnamese specialty' },
          { id: 5, title: 'XỐT CHẤM HẢI SẢN VÀ THỊT NƯỚNG', youtubeVideoId: 'LU6nK8Kn-tE', videoThumbnail: 'https://img.youtube.com/vi/LU6nK8Kn-tE/maxresdefault.jpg', price: 2.99, isForSale: true, difficulty: 'Easy', cookingTime: 20, servings: 4, category: 'Vietnamese', rating: 4.5, totalRatings: 98, viewCount: 98, purchaseCount: 0, description: 'Signature Vietnamese dipping sauce for seafood and BBQ' },
          { id: 6, title: 'GIÒ HEO CHIÊN MẮM GIÒN TAN', youtubeVideoId: 'eV9U9CVCGlI', videoThumbnail: 'https://img.youtube.com/vi/eV9U9CVCGlI/maxresdefault.jpg', price: 12.99, isForSale: true, difficulty: 'Hard', cookingTime: 180, servings: 4, category: 'Vietnamese', rating: 4.7, totalRatings: 180, viewCount: 180, purchaseCount: 0, description: 'Crispy deep-fried pork knuckle glazed with fish sauce' },
          { id: 7, title: 'PHỞ BÒ', youtubeVideoId: '6YlPZWMjQCE', videoThumbnail: 'https://img.youtube.com/vi/6YlPZWMjQCE/maxresdefault.jpg', price: 19.99, isForSale: true, difficulty: 'Hard', cookingTime: 300, servings: 4, category: 'Vietnamese', rating: 4.8, totalRatings: 540, viewCount: 540, purchaseCount: 0, description: 'Iconic Vietnamese beef noodle soup with aromatic broth' },
          { id: 8, title: 'MIẾN LƯƠNG', youtubeVideoId: '86oXUJNszjQ', videoThumbnail: 'https://img.youtube.com/vi/86oXUJNszjQ/maxresdefault.jpg', price: 7.99, isForSale: true, difficulty: 'Medium', cookingTime: 90, servings: 4, category: 'Vietnamese', rating: 4.6, totalRatings: 260, viewCount: 260, purchaseCount: 0, description: 'Vietnamese eel glass noodle soup, rich and flavorful' },
          { id: 9, title: 'NEM THÍNH', youtubeVideoId: 'CpsqnvGzC-w', videoThumbnail: 'https://img.youtube.com/vi/CpsqnvGzC-w/maxresdefault.jpg', price: 4.99, isForSale: true, difficulty: 'Medium', cookingTime: 90, servings: 4, category: 'Vietnamese', rating: 5.0, totalRatings: 100, viewCount: 100, purchaseCount: 0, description: 'Fermented pork roll with toasted rice powder and herbs' },
        ];
        if (!cancelled) setRecipes(featured);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [filters.search, filters.difficulty, filters.time, filters.sortBy, currentPage]);

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
                <h3>Found {pagination.total || filteredRecipes.length} video recipes</h3>
              </div>
              
              <div className="recipes-grid">
                {paginatedRecipes.map((recipe) => (
                  <div className="recipe-card" key={recipe.id}>
                    <div className="recipe-video">
                      <VideoPreview
                        videoId={recipe.youtubeVideoId}
                        thumbnail={recipe.videoThumbnail ?? undefined}
                        duration={`${Math.floor(recipe.cookingTime / 60)}:${(recipe.cookingTime % 60).toString().padStart(2, '0')}`}
                        height="200px"
                        onPlay={() => console.log('Playing video:', recipe.id)}
                      />
                      <div className="recipe-badge">{recipe.category}</div>
                      <div className="recipe-overlay">
                        <button 
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!isAuthenticated()) {
                              navigate('/login');
                              return;
                            }
                            try {
                              await addToCart(recipe.id);
                              navigate('/checkout');
                            } catch (error) {
                              console.error('Failed to add to cart', error);
                              alert('Failed to add recipe to cart. Please try again.');
                            }
                          }}
                          className="btn btn-small"
                        >
                          <i className="fas fa-play"></i> Watch Recipe
                        </button>
                      </div>
                      <div className="recipe-actions">
                        <button className="action-btn favorite-btn" data-tooltip="Add to favorites">
                          <i className="far fa-heart"></i>
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
                          onPurchase={async () => {
                            if (!isAuthenticated()) {
                              navigate('/login');
                              return;
                            }
                            try {
                              await addToCart(recipe.id);
                              // Stay on page to continue browsing
                            } catch (error) {
                              console.error('Failed to add to cart', error);
                              alert('Failed to add recipe to cart. Please try again.');
                            }
                          }}
                        />
                        <div className="recipe-author">
                          <span className="author-name">by {recipe.createdBy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRecipes.length === 0 && (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <h3>No recipes found</h3>
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

export default Recipes

