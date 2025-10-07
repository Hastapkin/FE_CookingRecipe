// React import not required with react-jsx runtime
import { Link } from 'react-router-dom'

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-background"><div className="hero-pattern"></div></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Discover <span className="gradient-text">Culinary</span></h1>
            <div className="hero-buttons">
              <Link to="/recipes" className="btn btn-primary">
                <i className="fas fa-utensils"></i>
                View Recipes
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item"><div className="stat-number">500+</div><div className="stat-label">Recipes</div></div>
              <div className="stat-item"><div className="stat-number">10K+</div><div className="stat-label">Users</div></div>
              <div className="stat-item"><div className="stat-number">4.9</div><div className="stat-label">Rating</div></div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-container">
              <img src="/images/hero-cooking.jpg" alt="Cooking" className="hero-img" />
              <div className="floating-card card-1"><i className="fas fa-fire"></i><span>Hot Dishes</span></div>
              <div className="floating-card card-2"><i className="fas fa-clock"></i><span>Quick</span></div>
              <div className="floating-card card-3"><i className="fas fa-heart"></i><span>Favorite</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-recipes">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Recipes</h2>
            <p className="section-subtitle">Most loved dishes</p>
          </div>
          <div className="recipes-grid">
            {[1,2,3].map((i) => (
              <div className="recipe-card" key={i}>
                <div className="recipe-image">
                  <img src={`/images/recipe-${i}.jpg`} alt={`Recipe ${i}`} />
                  <div className="recipe-badge">{i===1? 'Best Seller' : i===2 ? 'New' : 'Popular'}</div>
                  <div className="recipe-overlay"><Link to="/recipe-detail" className="btn btn-small">View Details</Link></div>
                  <div className="recipe-actions">
                    <button className="action-btn favorite-btn" data-tooltip="Add to favorites"><i className="far fa-heart"></i></button>
                    <button className="action-btn share-btn" data-tooltip="Share"><i className="fas fa-share-alt"></i></button>
                  </div>
                </div>
                <div className="recipe-content">
                  <div className="recipe-header">
                    <h3 className="recipe-title">Sample Recipe {i}</h3>
                    <div className="recipe-rating"><div className="stars">{Array.from({length:5}).map((_,idx)=>(<i key={idx} className="fas fa-star"></i>))}</div><span className="rating-text">(4.{9-i})</span></div>
                  </div>
                  <p className="recipe-description">Delicious sample description</p>
                  <div className="recipe-meta">
                    <span className="recipe-time"><i className="fas fa-clock"></i> 1 hour</span>
                    <span className="recipe-difficulty difficulty-medium"><i className="fas fa-signal"></i> Medium</span>
                    <span className="recipe-price"><i className="fas fa-tag"></i> $2.00</span>
                  </div>
                  <div className="recipe-footer">
                    <button className="btn btn-primary btn-small">Buy Now</button>
                    <div className="recipe-author"><img src="/images/avatar-placeholder.jpg" alt="Author" className="author-avatar" /><span className="author-name">Chef</span></div>
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

