import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main>
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-illustration">
            <div className="error-code">404</div>
            <div className="error-icon">
              <i className="fas fa-search"></i>
            </div>
          </div>
          
          <h1>Page Not Found</h1>
          <p className="not-found-message">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-large">
              <i className="fas fa-home"></i>
              Go Home
            </Link>
            <Link to="/recipes" className="btn btn-outline btn-large">
              <i className="fas fa-book-open"></i>
              Browse Recipes
            </Link>
          </div>
          
          <div className="not-found-suggestions">
            <h3>You might be interested in:</h3>
            <div className="suggestion-links">
              <Link to="/recipes" className="suggestion-link">
                <i className="fas fa-utensils"></i>
                <span>Explore Recipes</span>
              </Link>
              <Link to="/about" className="suggestion-link">
                <i className="fas fa-info-circle"></i>
                <span>About Us</span>
              </Link>
              <Link to="/contact" className="suggestion-link">
                <i className="fas fa-envelope"></i>
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NotFound
