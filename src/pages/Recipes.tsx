// React import not required with react-jsx runtime
import { Link } from 'react-router-dom'

function Recipes() {
  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Recipes</h1>
          <p className="page-subtitle">Discover thousands of recipes from around the world</p>
        </div>
      </section>

      <section className="search-filter">
        <div className="container">
          <div className="filter-section">
            <div className="filter-group">
              <label>Category:</label>
              <select className="filter-select">
                <option value="">All</option>
                <option value="vietnamese">Vietnamese</option>
                <option value="asian">Asian</option>
                <option value="western">Western</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Difficulty:</label>
              <select className="filter-select">
                <option value="">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Time:</label>
              <select className="filter-select">
                <option value="">All</option>
                <option value="30">Under 30 min</option>
                <option value="60">30-60 min</option>
                <option value="120">1-2 hours</option>
                <option value="120+">Over 2 hours</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort by:</label>
              <select className="filter-select">
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="price-low">Price Low</option>
                <option value="price-high">Price High</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="recipes-section">
        <div className="container">
          <div className="recipes-grid">
            {Array.from({length:6}).map((_,i) => (
              <div className="recipe-card" key={i}>
                <div className="recipe-image">
                  <img src={`/images/recipe-${i+1}.jpg`} alt={`Recipe ${i+1}`} />
                  <div className="recipe-badge">Vietnamese</div>
                  <div className="recipe-overlay"><Link to="/recipe-detail" className="btn btn-small">View Details</Link></div>
                </div>
                <div className="recipe-content">
                  <h3 className="recipe-title">Recipe {i+1}</h3>
                  <p className="recipe-description">Sample description</p>
                  <div className="recipe-meta">
                    <span className="recipe-time"><i className="fas fa-clock"></i> 1 hour</span>
                    <span className="recipe-difficulty"><i className="fas fa-signal"></i> Medium</span>
                    <span className="recipe-rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="far fa-star"></i>
                      <span className="rating-text">(4.{i})</span>
                    </span>
                  </div>
                  <div className="recipe-footer">
                    <span className="recipe-price">$2.00</span>
                    <button className="btn btn-primary btn-small">Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button className="pagination-btn prev" disabled><i className="fas fa-chevron-left"></i> Previous</button>
            <div className="pagination-numbers">
              {[1,2,3,4,5].map(n => <button key={n} className={`pagination-number ${n===1? 'active':''}`}>{n}</button>)}
            </div>
            <button className="pagination-btn next">Next <i className="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Recipes

