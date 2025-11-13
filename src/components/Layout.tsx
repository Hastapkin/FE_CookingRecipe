import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { getUserSession, clearUserSession } from '../services/auth'

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ username?: string; name?: string; email?: string } | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const updateUser = () => {
    const session = getUserSession()
    if (session) {
      setCurrentUser({ username: session.user.username, name: session.user.username, email: session.user.username })
    } else {
      setCurrentUser(null)
    }
  }

  useEffect(() => {
    updateUser()
    
    // Listen for storage events (from other tabs)
    const handler = () => {
      updateUser()
    }
    window.addEventListener('storage', handler)
    
    // Listen for custom auth events (from same tab)
    const authHandler = () => {
      updateUser()
    }
    window.addEventListener('authStateChanged', authHandler)
    
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('authStateChanged', authHandler)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleLogout = () => {
    clearUserSession()
    setCurrentUser(null)
    navigate('/')
  }

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
              {currentUser ? (
                <>
                  <NavLink 
                    to="/my-recipes" 
                    className="btn btn-outline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-book"></i> 
                    <span className="hide-sm">My Recipes</span>
                  </NavLink>
                  <div className="dropdown-container" ref={dropdownRef}>
                    <button 
                      className="btn btn-outline dropdown-toggle"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <i className="fas fa-shopping-bag"></i>
                      <span className="hide-sm">Orders</span>
                      <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                    </button>
                    {dropdownOpen && (
                      <div className="dropdown-menu">
                        <NavLink 
                          to="/cart" 
                          className="dropdown-item"
                          onClick={() => {
                            setDropdownOpen(false)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <i className="fas fa-shopping-cart"></i>
                          <span>Cart</span>
                        </NavLink>
                        <NavLink 
                          to="/my-orders" 
                          className="dropdown-item"
                          onClick={() => {
                            setDropdownOpen(false)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <i className="fas fa-receipt"></i>
                          <span>My Orders</span>
                        </NavLink>
                      </div>
                    )}
                  </div>
                  <div className="btn btn-outline" style={{display:'flex', gap:8, alignItems:'center'}}>
                    <i className="fas fa-user-circle"></i>
                    <span className="hide-sm">{currentUser.username || currentUser.name || currentUser.email}</span>
                  </div>
                  <button className="btn btn-primary" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span className="hide-sm">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="dropdown-container" ref={dropdownRef}>
                    <button 
                      className="btn btn-outline dropdown-toggle"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <i className="fas fa-shopping-bag"></i>
                      <span className="hide-sm">Orders</span>
                      <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                    </button>
                    {dropdownOpen && (
                      <div className="dropdown-menu">
                        <NavLink 
                          to="/cart" 
                          className="dropdown-item"
                          onClick={() => {
                            setDropdownOpen(false)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <i className="fas fa-shopping-cart"></i>
                          <span>Cart</span>
                        </NavLink>
                        <NavLink 
                          to="/my-orders" 
                          className="dropdown-item"
                          onClick={() => {
                            setDropdownOpen(false)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <i className="fas fa-receipt"></i>
                          <span>My Orders</span>
                        </NavLink>
                      </div>
                    )}
                  </div>
                  <NavLink 
                    to="/login" 
                    className="btn btn-outline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    <span className="hide-sm">Login</span>
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    className="btn btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-user-plus"></i>
                    <span className="hide-sm">Register</span>
                  </NavLink>
                </>
              )}
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
                <a href="https://www.facebook.com/anhchefvn" aria-label="Facebook" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.tiktok.com/@anhdaubep_vn" aria-label="TikTok" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-tiktok"></i>
                </a>
                <a href="https://www.youtube.com/@anhdaubep/videos" aria-label="YouTube" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Newsletter</h4>
              <p className="newsletter-text">
                Subscribe to get updates on new recipes and exclusive offers!
              </p>
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
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
