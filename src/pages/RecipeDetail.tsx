import { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import YouTubePlayer from '../components/YouTubePlayer'
import PriceButton from '../components/PriceButton'
import type { Recipe } from '../types/recipe'
import { fetchRecipeById } from '../services/recipes'
import { getRecipeRatings, getMyRating, submitRating, deleteRating, type Rating } from '../services/ratings'
import { isAuthenticated, getUserSession } from '../services/auth'
import { addToCart } from '../services/cart'
import { fetchMyRecipes } from '../services/recipes'

function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition' | 'reviews'>('ingredients');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [myRating, setMyRating] = useState<Rating | null>(null);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [ratingForm, setRatingForm] = useState({ ratingScore: 5, comment: '' });
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const autoplay = new URLSearchParams(location.search).get('autoplay') === '1';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!id) return;
        // Try to fetch with auth first (for full details), fallback to public if not authenticated
        let data = null;
        try {
          data = await fetchRecipeById(Number(id), true);
        } catch (authError) {
          // If auth fails, try without auth (public overview)
          try {
            data = await fetchRecipeById(Number(id), false);
          } catch (publicError) {
            console.error('Failed to fetch recipe:', publicError);
          }
        }
        if (!cancelled) {
          if (data) {
            setRecipe(data);
          } else {
            // Fallback to FE sample data
            const samples = getSampleRecipes();
            const found = samples.find(r => r.id === Number(id)) || null;
            setRecipe(found);
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load recipe', e);
        // Fallback to FE sample data on error
        const samples = getSampleRecipes();
        const found = samples.find(r => r.id === Number(id)) || null;
        if (!cancelled) setRecipe(found);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [id]);

  // Fetch ratings when reviews tab is active or recipe is loaded
  useEffect(() => {
    if (!id || !recipe) return;
    
    let cancelled = false;
    (async () => {
      setRatingsLoading(true);
      try {
        const ratingsData = await getRecipeRatings(Number(id));
        if (!cancelled) {
          setRatings(ratingsData.ratings || []);
        }
      } catch (error) {
        console.error('Failed to load ratings', error);
        if (!cancelled) {
          setRatings([]);
        }
      } finally {
        if (!cancelled) {
          setRatingsLoading(false);
        }
      }
    })();
    return () => { cancelled = true };
  }, [id, recipe]);

  // Check if recipe is purchased and fetch user's rating if authenticated
  useEffect(() => {
    if (!id || !isAuthenticated()) {
      setIsPurchased(false);
      return;
    }
    
    let cancelled = false;
    (async () => {
      try {
        // Check if recipe is in purchased recipes
        const myRecipes = await fetchMyRecipes({});
        const purchased = myRecipes.recipes.some(r => r.id === Number(id));
        if (!cancelled) {
          setIsPurchased(purchased);
        }

        // Fetch user's rating
        try {
          const myRatingData = await getMyRating(Number(id));
          if (!cancelled) {
            setMyRating(myRatingData);
            if (myRatingData) {
              setRatingForm({
                ratingScore: myRatingData.ratingScore,
                comment: myRatingData.comment || ''
              });
            }
          }
        } catch (error) {
          console.error('Failed to load my rating', error);
          if (!cancelled) {
            setMyRating(null);
          }
        }
      } catch (error) {
        console.error('Failed to check purchase status', error);
        if (!cancelled) {
          setIsPurchased(false);
        }
      }
    })();
    return () => { cancelled = true };
  }, [id]);

  const handleSubmitRating = async () => {
    if (!id) return;
    setIsSubmittingRating(true);
    try {
      const submitted = await submitRating(
        Number(id),
        ratingForm.ratingScore,
        ratingForm.comment || undefined
      );
      setMyRating(submitted);
      setIsEditingRating(false);
      
      // Refresh ratings list
      const ratingsData = await getRecipeRatings(Number(id));
      setRatings(ratingsData.ratings || []);
    } catch (error) {
      console.error('Failed to submit rating', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!myRating || !id) return;
    if (!confirm('Are you sure you want to delete your rating?')) return;
    
    try {
      await deleteRating(myRating.id);
      setMyRating(null);
      setRatingForm({ ratingScore: 5, comment: '' });
      setIsEditingRating(false);
      
      // Refresh ratings list
      const ratingsData = await getRecipeRatings(Number(id));
      setRatings(ratingsData.ratings || []);
    } catch (error) {
      console.error('Failed to delete rating', error);
      alert('Failed to delete rating. Please try again.');
    }
  };

  const startEditing = () => {
    if (myRating) {
      setRatingForm({
        ratingScore: myRating.ratingScore,
        comment: myRating.comment || ''
      });
    }
    setIsEditingRating(true);
  };

  const cancelEditing = () => {
    setIsEditingRating(false);
    if (myRating) {
      setRatingForm({
        ratingScore: myRating.ratingScore,
        comment: myRating.comment || ''
      });
    } else {
      setRatingForm({ ratingScore: 5, comment: '' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  };

  function toIngredients(items: string[]) {
    return items.map(label => ({ label, quantity: 0, measurement: '' })) as NonNullable<Recipe['ingredients']>;
  }

  function toInstructions(items: string[]) {
    return items.map((content, idx) => ({ step: idx + 1, content })) as NonNullable<Recipe['instructions']>;
  }

  function getSampleRecipes() {
    return [
      { id: 1, title: 'BÚN CHẢ', youtubeVideoId: 'V37douhyx_0', videoThumbnail: 'https://img.youtube.com/vi/V37douhyx_0/maxresdefault.jpg', price: 9.99, isForSale: true, difficulty: 'Medium', cookingTime: 120, servings: 4, category: 'Vietnamese', rating: 4.8, totalRatings: 156, viewCount: 156, purchaseCount: 0, description: 'Traditional Vietnamese grilled pork with vermicelli and herbs',
        ingredients: toIngredients([
          'Pork belly (lean and fat parts)', 'Ground pork (patties)', 'Shallots and garlic', 'Fish sauce', 'Sugar, pepper, oyster sauce', 'Vermicelli noodles (bún)', 'Mixed herbs', 'Pickled green papaya and carrots', 'Dipping sauce: fish sauce, broth, sugar, garlic, chili, lime'
        ]),
        instructions: toInstructions([
          'Slice pork belly; season ground pork with aromatics and sauces; marinate 1 hour',
          'Shape patties and grill pork belly and patties until golden',
          'Mix dipping sauce and add pickles',
          'Serve with bún, herbs, and dipping sauce'
        ])
      },
      { id: 2, title: 'CƠM TẤM', youtubeVideoId: 'P50LW8SzfXQ', videoThumbnail: 'https://img.youtube.com/vi/P50LW8SzfXQ/maxresdefault.jpg', price: 9.99, isForSale: true, difficulty: 'Medium', cookingTime: 120, servings: 4, category: 'Vietnamese', rating: 4.9, totalRatings: 320, viewCount: 320, purchaseCount: 0, description: 'Classic broken rice with grilled pork chop and accompaniments',
        ingredients: toIngredients([
          'Broken rice', 'Pork chops', 'Pork skin & pork (bì)', 'Chả trứng (steamed egg meatloaf)', 'Pickled carrot & daikon', 'Cucumber, tomato, herbs', 'Garlic, shallots, fish sauce, oyster sauce, sugar, pepper, honey', 'Mung bean noodles, wood ear mushrooms', 'Sweet fish sauce'
        ]),
        instructions: toInstructions([
          'Cook broken rice with proper water ratio',
          'Tenderize and marinate pork chops; grill over charcoal',
          'Make bì: boil skin, slice, toss with pork and toasted rice powder',
          'Steam chả trứng 25–30m; glaze with yolk',
          'Mix sweet fish sauce; assemble and serve'
        ])
      },
      { id: 3, title: 'GIẢ CẦY', youtubeVideoId: 'S-fBig2UEvA', videoThumbnail: 'https://img.youtube.com/vi/S-fBig2UEvA/maxresdefault.jpg', price: 7.99, isForSale: true, difficulty: 'Medium', cookingTime: 90, servings: 4, category: 'Vietnamese', rating: 4.7, totalRatings: 210, viewCount: 210, purchaseCount: 0, description: 'Vietnamese-style mock dog stew with aromatic spices',
        ingredients: toIngredients([
          'Pork trotters', 'Galangal, lemongrass, garlic, shallots', 'Fermented rice (mẻ), shrimp paste (mắm tôm)', 'Turmeric', 'Fish sauce, salt, MSG, sugar, pepper', 'Water or coconut water', 'Rice noodles'
        ]),
        instructions: toInstructions([
          'Grill trotters lightly; cut to pieces',
          'Marinate with aromatics, mẻ, mắm tôm, turmeric, fish sauce, seasonings',
          'Sear marinated pork; add liquid; simmer 45–60m until tender',
          'Adjust seasoning; serve hot with noodles or rice'
        ])
      },
      { id: 4, title: 'ẾCH ĐỒNG NƯỚNG NGHỆ', youtubeVideoId: '4BvbfoMT4SA', videoThumbnail: 'https://img.youtube.com/vi/4BvbfoMT4SA/maxresdefault.jpg', price: 4.99, isForSale: true, difficulty: 'Easy', cookingTime: 30, servings: 4, category: 'Vietnamese', rating: 4.6, totalRatings: 145, viewCount: 145, purchaseCount: 0, description: 'Grilled field frog with turmeric, a rustic Vietnamese specialty',
        ingredients: toIngredients([
          'Frog meat', 'Turmeric', 'Onion, garlic, chili', 'Salt, pepper', 'Cooking oil', 'Optional: fish sauce, oyster sauce, lemongrass'
        ]),
        instructions: toInstructions([
          'Clean and cut frog to bite-size',
          'Marinate with turmeric, aromatics, and seasonings 20–30m',
          'Grill over charcoal until cooked and slightly charred',
          'Serve hot with herbs or dipping sauce'
        ])
      },
      { id: 5, title: 'XỐT CHẤM HẢI SẢN VÀ THỊT NƯỚNG', youtubeVideoId: 'LU6nK8Kn-tE', videoThumbnail: 'https://img.youtube.com/vi/LU6nK8Kn-tE/maxresdefault.jpg', price: 2.99, isForSale: true, difficulty: 'Easy', cookingTime: 20, servings: 4, category: 'Vietnamese', rating: 4.5, totalRatings: 98, viewCount: 98, purchaseCount: 0, description: 'Signature Vietnamese dipping sauce for seafood and BBQ',
        ingredients: toIngredients([
          'Green chili seafood sauce: green chilies, bell pepper, lime juice, sugar, salt, lime leaves, condensed milk',
          'Lime pepper salt: salt, black pepper, lime juice, chili'
        ]),
        instructions: toInstructions([
          'Blend green chili sauce ingredients until smooth; chill 1 hour',
          'Mix salt, pepper, lime juice, chili for muối tiêu chanh',
          'Serve with seafood/meats'
        ])
      },
      { id: 6, title: 'GIÒ HEO CHIÊN MẮM GIÒN TAN', youtubeVideoId: 'eV9U9CVCGlI', videoThumbnail: 'https://img.youtube.com/vi/eV9U9CVCGlI/maxresdefault.jpg', price: 12.99, isForSale: true, difficulty: 'Hard', cookingTime: 180, servings: 4, category: 'Vietnamese', rating: 4.7, totalRatings: 180, viewCount: 180, purchaseCount: 0, description: 'Crispy deep-fried pork knuckle glazed with fish sauce',
        ingredients: toIngredients([
          'Pork knuckle', 'Salt, pepper, ginger', 'Fish sauce', 'Garlic, shallots, chili, onion', 'Sugar', 'Cooking oil'
        ]),
        instructions: toInstructions([
          'Clean/blanch knuckle; boil until just cooked; ice-bath; dry thoroughly',
          'Deep-fry until golden and crisp',
          'Sauté aromatics; make fish sauce-sugar glaze; toss knuckle to coat',
          'Chop and serve immediately'
        ])
      },
      { id: 7, title: 'PHỞ BÒ', youtubeVideoId: '6YlPZWMjQCE', videoThumbnail: 'https://img.youtube.com/vi/6YlPZWMjQCE/maxresdefault.jpg', price: 19.99, isForSale: true, difficulty: 'Hard', cookingTime: 300, servings: 4, category: 'Vietnamese', rating: 4.8, totalRatings: 540, viewCount: 540, purchaseCount: 0, description: 'Iconic Vietnamese beef noodle soup with aromatic broth',
        ingredients: toIngredients([
          'Rice noodles', 'Beef broth (beef bones, cinnamon, star anise, cloves, ginger, onions)', 'Beef cuts (rare slices, brisket, tendon, flank)', 'Scallions, basil, cilantro, sprouts, onion', 'Lime, chili or sauce'
        ]),
        instructions: toInstructions([
          'Simmer beef bones with spices for clear, rich broth',
          'Prepare noodles and beef cuts; assemble with garnishes',
          'Season with lime and chili to taste'
        ])
      },
      { id: 8, title: 'MIẾN LƯƠNG', youtubeVideoId: '86oXUJNszjQ', videoThumbnail: 'https://img.youtube.com/vi/86oXUJNszjQ/maxresdefault.jpg', price: 7.99, isForSale: true, difficulty: 'Medium', cookingTime: 90, servings: 4, category: 'Vietnamese', rating: 4.6, totalRatings: 260, viewCount: 260, purchaseCount: 0, description: 'Vietnamese eel glass noodle soup, rich and flavorful',
        ingredients: toIngredients([
          'Eel', 'Vermicelli noodles (miến)', 'Kaffir & ginger leaves (steam option)', 'Turmeric, shallots, betel leaves (grill option)', 'Garlic, chili, fish sauce, sugar, salt, pepper', 'Herbs and greens'
        ]),
        instructions: toInstructions([
          'Clean eel; choose fry, steam, or marinate & grill method',
          'Prepare miến and broth/sauce; assemble with eel and herbs'
        ])
      },
      { id: 9, title: 'NEM THÍNH', youtubeVideoId: 'CpsqnvGzC-w', videoThumbnail: 'https://img.youtube.com/vi/CpsqnvGzC-w/maxresdefault.jpg', price: 4.99, isForSale: true, difficulty: 'Medium', cookingTime: 90, servings: 4, category: 'Vietnamese', rating: 5.0, totalRatings: 100, viewCount: 100, purchaseCount: 0, description: 'Fermented pork roll with toasted rice powder and herbs',
        ingredients: toIngredients([
          'Boiled pork (sliced)', 'Pork skin (thinly sliced)', 'Toasted rice powder (thính)', 'Fig leaves, lime leaves, Thai basil, spearmint', 'Fish sauce, garlic, chili (dipping)'
        ]),
        instructions: toInstructions([
          'Boil and slice pork; slice skin',
          'Coat pork with toasted rice powder',
          'Serve with fresh herbs and fish sauce-garlic-chili dipping'
        ])
      },
    ] as Recipe[]
  }

  const handlePurchase = async () => {
    if (!recipe || !isAuthenticated()) {
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
  };

  const handleViewPurchased = () => {
    if (!recipe || !isAuthenticated()) {
      navigate('/login');
      return;
    }
    // If not purchased, redirect to cart
    if (!isPurchased) {
      navigate('/cart');
    }
    // If purchased, already viewing the recipe
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
          <div className="recipe-content">
            <div className="recipe-header">
              <div className="recipe-video-section">
                <YouTubePlayer
                  videoId={recipe.youtubeVideoId}
                  title={recipe.title}
                  width="100%"
                  height="400px"
                  autoplay={autoplay}
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
                  {recipe.nutrition && recipe.nutrition.length > 0 ? (
                    <>
                      <div className="nutrition-grid">
                        {recipe.nutrition.map((nutrient, index) => (
                          <div key={index} className="nutrition-item">
                            <span className="nutrition-label">
                              {nutrient.type.charAt(0).toUpperCase() + nutrient.type.slice(1)}
                            </span>
                            <span className="nutrition-value">
                              {nutrient.quantity} {nutrient.measurement}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="nutrition-note">*Nutrition information is per serving</p>
                    </>
                  ) : (
                    <div className="no-results" style={{padding: '3rem 1rem', textAlign: 'center'}}>
                      <i className="fas fa-chart-pie" style={{fontSize: '3rem', color: '#9CA3AF', marginBottom: '1rem'}}></i>
                      <h3>No nutrition information available</h3>
                      <p>Nutrition information has not been provided for this recipe.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-section">
                  <div className="reviews-header">
                    <h3>Customer Reviews</h3>
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <span className="rating-number">{recipe.rating.toFixed(1)}</span>
                        <div className="rating-stars">
                          {Array.from({length: 5}).map((_, idx) => (
                            <i 
                              key={idx} 
                              className={idx < Math.floor(recipe.rating) ? "fas fa-star" : "far fa-star"}
                            />
                          ))}
                        </div>
                        <span className="rating-count">({recipe.totalRatings} review{recipe.totalRatings !== 1 ? 's' : ''})</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Form - Show if authenticated and (no rating exists or editing) */}
                  {isAuthenticated() && (!myRating || isEditingRating) && (
                    <div className="rating-form" style={{
                      background: '#F9FAFB',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      marginBottom: '2rem',
                      border: '1px solid #E5E7EB'
                    }}>
                      <h4 style={{marginBottom: '1rem', fontSize: '1.1rem'}}>
                        {myRating ? 'Edit Your Rating' : 'Write a Review'}
                      </h4>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                          Rating
                        </label>
                        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setRatingForm({...ratingForm, ratingScore: score})}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                color: score <= ratingForm.ratingScore ? '#FBBF24' : '#D1D5DB',
                                padding: '0.25rem'
                              }}
                            >
                              <i className={score <= ratingForm.ratingScore ? "fas fa-star" : "far fa-star"}></i>
                            </button>
                          ))}
                          <span style={{marginLeft: '0.5rem', color: '#6B7280'}}>
                            {ratingForm.ratingScore} / 5
                          </span>
                        </div>
                      </div>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                          Comment (optional)
                        </label>
                        <textarea
                          value={ratingForm.comment}
                          onChange={(e) => setRatingForm({...ratingForm, comment: e.target.value})}
                          placeholder="Share your thoughts about this recipe..."
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '0.95rem',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                      <div style={{display: 'flex', gap: '0.75rem'}}>
                        <button
                          onClick={handleSubmitRating}
                          disabled={isSubmittingRating}
                          className="btn btn-primary"
                          style={{minWidth: '120px'}}
                        >
                          {isSubmittingRating ? 'Submitting...' : (myRating ? 'Update Rating' : 'Submit Rating')}
                        </button>
                        {myRating && (
                          <button
                            onClick={cancelEditing}
                            disabled={isSubmittingRating}
                            className="btn btn-outline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* My Rating Display (when not editing) */}
                  {isAuthenticated() && myRating && !isEditingRating && (
                    <div className="my-rating" style={{
                      background: '#EFF6FF',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1.5rem',
                      border: '1px solid #BFDBFE'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                        <strong style={{color: '#1E40AF'}}>Your Rating</strong>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <button
                            onClick={startEditing}
                            className="btn btn-outline"
                            style={{padding: '0.375rem 0.75rem', fontSize: '0.875rem'}}
                          >
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button
                            onClick={handleDeleteRating}
                            className="btn btn-outline"
                            style={{padding: '0.375rem 0.75rem', fontSize: '0.875rem', color: '#DC2626'}}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                        {Array.from({length: 5}).map((_, idx) => (
                          <i 
                            key={idx} 
                            className={idx < myRating.ratingScore ? "fas fa-star" : "far fa-star"}
                            style={{color: '#FBBF24'}}
                          />
                        ))}
                      </div>
                      {myRating.comment && (
                        <p style={{color: '#374151', margin: 0}}>{myRating.comment}</p>
                      )}
                    </div>
                  )}

                  {ratingsLoading ? (
                    <div className="loading-container" style={{padding: '2rem'}}>
                      <div className="loading-spinner"></div>
                      <p>Loading reviews...</p>
                    </div>
                  ) : ratings.length === 0 ? (
                    <div className="no-results" style={{padding: '3rem 1rem'}}>
                      <i className="fas fa-comments" style={{fontSize: '3rem', color: '#9CA3AF', marginBottom: '1rem'}}></i>
                      <h3>No reviews yet</h3>
                      <p>Be the first to review this recipe!</p>
                    </div>
                  ) : (
                    <div className="reviews-list">
                      {ratings.map((rating) => {
                        const currentUser = getUserSession();
                        const isMyRating = currentUser && rating.userId === currentUser.user.id;

                        return (
                          <div 
                            key={rating.id} 
                            className="review-item"
                            style={isMyRating ? {
                              background: '#F0F9FF',
                              border: '1px solid #BAE6FD',
                              borderRadius: '8px',
                              padding: '1rem'
                            } : {}}
                          >
                            <div className="review-header">
                              <div className="reviewer-info">
                                <div className="reviewer-avatar">
                                  <i className="fas fa-user"></i>
                                </div>
                                <div className="reviewer-details">
                                  <span className="reviewer-name">
                                    {rating.username}
                                    {isMyRating && (
                                      <span style={{
                                        marginLeft: '0.5rem',
                                        fontSize: '0.75rem',
                                        color: '#1E40AF',
                                        fontWeight: '500'
                                      }}>(You)</span>
                                    )}
                                  </span>
                                  <div className="review-rating">
                                    {Array.from({length: 5}).map((_, idx) => (
                                      <i 
                                        key={idx} 
                                        className={idx < rating.ratingScore ? "fas fa-star" : "far fa-star"}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="review-date">{formatDate(rating.createdAt)}</span>
                            </div>
                            {rating.comment && (
                              <p className="review-text">{rating.comment}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
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

