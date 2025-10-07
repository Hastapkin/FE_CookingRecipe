import { useState } from 'react'

function RecipeDetail() {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition' | 'reviews'>('ingredients')
  return (
    <main>
      <section className="recipe-detail">
        <div className="container">
          <nav className="breadcrumb">
            <a href="/">Home</a>
            <span className="separator">/</span>
            <a href="/recipes">Recipes</a>
            <span className="separator">/</span>
            <span className="current">Hanoi Beef Pho</span>
          </nav>

          <div className="recipe-content">
            <div className="recipe-header">
              <div className="recipe-image">
                <img src="/images/recipe-1.jpg" alt="Hanoi Beef Pho" />
                <div className="recipe-badge">Vietnamese</div>
                <div className="recipe-actions">
                  <button className="action-btn favorite" title="Favorite"><i className="far fa-heart"></i></button>
                  <button className="action-btn share" title="Share"><i className="fas fa-share-alt"></i></button>
                </div>
              </div>
              <div className="recipe-info">
                <h1 className="recipe-title">Hanoi Beef Pho</h1>
                <p className="recipe-description">Traditional Hanoi pho with rich broth, fresh beef and soft rice noodles.</p>
                <div className="recipe-meta">
                  <div className="meta-item"><i className="fas fa-clock"></i><span>Time: 2 hours</span></div>
                  <div className="meta-item"><i className="fas fa-users"></i><span>Servings: 4 people</span></div>
                  <div className="meta-item"><i className="fas fa-signal"></i><span>Difficulty: Hard</span></div>
                  <div className="meta-item"><i className="fas fa-star"></i><span>Rating: 4.8/5 (128 reviews)</span></div>
                </div>
                <div className="recipe-price-section">
                  <div className="price-info"><span className="price-label">Recipe Price:</span><span className="price">$2.50</span></div>
                  <div className="purchase-actions">
                    <button className="btn btn-primary btn-large"><i className="fas fa-shopping-cart"></i> Buy Now</button>
                    <button className="btn btn-secondary btn-large"><i className="fas fa-heart"></i> Favorite</button>
                  </div>
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
              <div className={`tab-pane ${activeTab==='ingredients'? 'active':''}`} id="ingredients">
                <div className="ingredients-section">
                  <h3>Ingredients needed</h3>
                  <div className="ingredients-grid">
                    <div className="ingredient-category">
                      <h4>Broth:</h4>
                      <ul className="ingredient-list">
                        <li>1kg beef bones</li>
                        <li>500g beef shank</li>
                        <li>2 onions</li>
                        <li>1 ginger root</li>
                      </ul>
                    </div>
                    <div className="ingredient-category">
                      <h4>Meat and noodles:</h4>
                      <ul className="ingredient-list">
                        <li>400g fresh rice noodles</li>
                        <li>300g thinly sliced beef</li>
                      </ul>
                    </div>
                    <div className="ingredient-category">
                      <h4>Herbs:</h4>
                      <ul className="ingredient-list">
                        <li>Green onions</li>
                        <li>Cilantro</li>
                        <li>Thai basil</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane ${activeTab==='instructions'? 'active':''}`} id="instructions">
                <div className="instructions-section">
                  <h3>How to make Hanoi Beef Pho</h3>
                  <div className="steps">
                    <div className="step"><div className="step-number">1</div><div className="step-content"><h4>Prepare the broth</h4><p>Clean beef bones...</p></div></div>
                    <div className="step"><div className="step-number">2</div><div className="step-content"><h4>Roast onions and ginger</h4><p>Roast onions and ginger...</p></div></div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane ${activeTab==='nutrition'? 'active':''}`} id="nutrition">
                <div className="nutrition-section">
                  <h3>Nutritional information (per serving)</h3>
                  <div className="nutrition-grid">
                    <div className="nutrition-item"><span className="nutrition-label">Calories</span><span className="nutrition-value">450 kcal</span></div>
                    <div className="nutrition-item"><span className="nutrition-label">Protein</span><span className="nutrition-value">35g</span></div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane ${activeTab==='reviews'? 'active':''}`} id="reviews">
                <div className="reviews-section">
                  <h3>Customer reviews</h3>
                  <div className="reviews-list">
                    <div className="review-item"><div className="review-header"><div className="reviewer-info"><div className="reviewer-avatar">A</div><div className="reviewer-details"><h4>John Smith</h4><div className="review-rating"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div></div></div><div className="review-date">2 days ago</div></div><div className="review-content"><p>Very detailed and easy to understand recipe.</p></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RecipeDetail

