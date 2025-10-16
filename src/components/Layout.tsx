import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div>
      <header className="header">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-utensils"></i>
                <span>Cooking Recipe</span>
              </NavLink>
            </div>
            
            <ul className={`nav-menu ${mobileMenuOpen ? 'mobile-active' : ''}`}>
              <li className="nav-item">
                <NavLink 
                  to="/" 
                  end 
                  className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-home"></i>
                  <span>Home</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/recipes" 
                  className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-book-open"></i>
                  <span>Recipes</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/about" 
                  className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-info-circle"></i>
                  <span>About</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/contact" 
                  className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-envelope"></i>
                  <span>Contact</span>
                </NavLink>
              </li>
            </ul>
            
            <div className={`nav-auth ${mobileMenuOpen ? 'mobile-active' : ''}`}>
              <NavLink 
                to="/my-orders" 
                className="btn btn-outline"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-shopping-bag"></i> 
                <span className="hide-sm">My Orders</span>
              </NavLink>
              <a href="#" className="btn btn-outline" id="loginBtn">
                <i className="fas fa-sign-in-alt"></i>
                <span className="hide-sm">Login</span>
              </a>
              <a href="#" className="btn btn-primary" id="registerBtn">
                <i className="fas fa-user-plus"></i>
                <span className="hide-sm">Register</span>
              </a>
            </div>
            
            <div 
              className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              role="button"
              aria-label="Toggle navigation"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>
        </nav>
      </header>

      <Outlet />

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <i className="fas fa-utensils"></i>
                <span>Cooking Recipe</span>
              </div>
              <p className="footer-description">
                Learn from professional chefs through step-by-step video tutorials. 
                Master cooking with our exclusive recipe collection.
              </p>
              <div className="social-links">
                <a href="#" aria-label="Facebook" className="social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="Instagram" className="social-link">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" aria-label="Twitter" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" aria-label="YouTube" className="social-link">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" aria-label="Pinterest" className="social-link">
                  <i className="fab fa-pinterest"></i>
                </a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                <li><NavLink to="/recipes"><i className="fas fa-chevron-right"></i> Browse Recipes</NavLink></li>
                <li><NavLink to="/about"><i className="fas fa-chevron-right"></i> About Us</NavLink></li>
                <li><NavLink to="/contact"><i className="fas fa-chevron-right"></i> Contact</NavLink></li>
                <li><NavLink to="/my-orders"><i className="fas fa-chevron-right"></i> My Orders</NavLink></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Categories</h4>
              <ul className="footer-links">
                <li><a href="/recipes?category=Vietnamese"><i className="fas fa-chevron-right"></i> Vietnamese</a></li>
                <li><a href="/recipes?category=Japanese"><i className="fas fa-chevron-right"></i> Japanese</a></li>
                <li><a href="/recipes?category=Italian"><i className="fas fa-chevron-right"></i> Italian</a></li>
                <li><a href="/recipes?category=Thai"><i className="fas fa-chevron-right"></i> Thai</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Newsletter</h4>
              <p className="newsletter-text">
                Subscribe to get updates on new recipes and exclusive offers!
              </p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
              <div className="footer-badges">
                <div className="badge-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Payment</span>
                </div>
                <div className="badge-item">
                  <i className="fas fa-star"></i>
                  <span>Quality Content</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2024 Cooking Recipe. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <span className="separator">•</span>
              <a href="#">Terms of Service</a>
              <span className="separator">•</span>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
