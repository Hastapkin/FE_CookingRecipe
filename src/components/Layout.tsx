import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { getUserSession, clearUserSession, getProfile, type User } from '../services/auth'

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [infoDropdownOpen, setInfoDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const infoDropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const isAdmin = (currentUser?.role || '').toLowerCase() === 'admin'

  const updateUser = async () => {
    const session = getUserSession()
    if (session) {
      // Try to get fresh profile data with profile picture
      try {
        const profile = await getProfile()
        setCurrentUser(profile)
        // Update session with fresh data
        if (session.token) {
          const updatedSession = { ...profile, token: session.token }
          localStorage.setItem('user', JSON.stringify(updatedSession))
        }
      } catch (error) {
        // Fallback to session data if profile fetch fails
        setCurrentUser(session.user)
      }
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
      if (infoDropdownRef.current && !infoDropdownRef.current.contains(event.target as Node)) {
        setInfoDropdownOpen(false)
      }
    }

    if (dropdownOpen || userDropdownOpen || infoDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen, userDropdownOpen, infoDropdownOpen])

  const handleLogout = () => {
    clearUserSession()
    setCurrentUser(null)
    setUserDropdownOpen(false)
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
              {isAdmin ? (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/admin/recipes"
                      end
                      className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setDropdownOpen(false)
                        setInfoDropdownOpen(false)
                      }}
                    >
                      <i className="fas fa-book-open"></i>
                      <span>Recipes</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/admin/recipes/new"
                      className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setDropdownOpen(false)
                        setInfoDropdownOpen(false)
                      }}
                    >
                      <i className="fas fa-plus-circle"></i>
                      <span>Add Recipe</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/admin/transactions"
                      className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setDropdownOpen(false)
                        setInfoDropdownOpen(false)
                      }}
                    >
                      <i className="fas fa-receipt"></i>
                      <span>Transactions</span>
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
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
                    <div className="dropdown-container" ref={infoDropdownRef}>
                      <button 
                        className="nav-link dropdown-toggle"
                        onClick={() => setInfoDropdownOpen(!infoDropdownOpen)}
                      >
                        <i className="fas fa-info-circle"></i>
                        <span>Info</span>
                        <i className={`fas fa-chevron-${infoDropdownOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                      </button>
                      {infoDropdownOpen && (
                        <div className="dropdown-menu">
                          <NavLink 
                            to="/about" 
                            className="dropdown-item"
                            onClick={() => {
                              setInfoDropdownOpen(false)
                              setMobileMenuOpen(false)
                            }}
                          >
                            <i className="fas fa-info-circle"></i>
                            <span>About</span>
                          </NavLink>
                          <NavLink 
                            to="/contact" 
                            className="dropdown-item"
                            onClick={() => {
                              setInfoDropdownOpen(false)
                              setMobileMenuOpen(false)
                            }}
                          >
                            <i className="fas fa-envelope"></i>
                            <span>Contact</span>
                          </NavLink>
                        </div>
                      )}
                    </div>
                  </li>
                </>
              )}
            </ul>
            
            <div className={`nav-auth ${mobileMenuOpen ? 'mobile-active' : ''}`}>
              {currentUser ? (
                isAdmin ? (
                  <div className="dropdown-container user-dropdown-container" ref={userDropdownRef}>
                    <button 
                      className="btn btn-outline user-dropdown-toggle"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    >
                      {currentUser.profilePicture ? (
                        <img 
                          src={currentUser.profilePicture} 
                          alt={currentUser.username}
                          className="user-avatar"
                        />
                      ) : (
                        <div className="user-avatar-placeholder">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                      <span className="hide-sm">{currentUser.username}</span>
                      <i className={`fas fa-chevron-${userDropdownOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                    </button>
                    {userDropdownOpen && (
                      <div className="dropdown-menu user-dropdown-menu">
                        <div className="dropdown-header">
                          {currentUser.profilePicture ? (
                            <img 
                              src={currentUser.profilePicture} 
                              alt={currentUser.username}
                              className="dropdown-avatar"
                            />
                          ) : (
                            <div className="dropdown-avatar-placeholder">
                              <i className="fas fa-user"></i>
                            </div>
                          )}
                          <span className="dropdown-username">{currentUser.username}</span>
                        </div>
                        <NavLink 
                          to="/profile-picture" 
                          className="dropdown-item"
                          onClick={() => {
                            setUserDropdownOpen(false)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <i className="fas fa-camera"></i>
                          <span>Change Profile Picture</span>
                        </NavLink>
                        <button
                          className="dropdown-item dropdown-item-danger"
                          onClick={handleLogout}
                        >
                          <i className="fas fa-sign-out-alt"></i>
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
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
                    <div className="dropdown-container user-dropdown-container" ref={userDropdownRef}>
                      <button 
                        className="btn btn-outline user-dropdown-toggle"
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      >
                        {currentUser.profilePicture ? (
                          <img 
                            src={currentUser.profilePicture} 
                            alt={currentUser.username}
                            className="user-avatar"
                          />
                        ) : (
                          <div className="user-avatar-placeholder">
                            <i className="fas fa-user"></i>
                          </div>
                        )}
                        <span className="hide-sm">{currentUser.username}</span>
                        <i className={`fas fa-chevron-${userDropdownOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                      </button>
                      {userDropdownOpen && (
                        <div className="dropdown-menu user-dropdown-menu">
                          <div className="dropdown-header">
                            {currentUser.profilePicture ? (
                              <img 
                                src={currentUser.profilePicture} 
                                alt={currentUser.username}
                                className="dropdown-avatar"
                              />
                            ) : (
                              <div className="dropdown-avatar-placeholder">
                                <i className="fas fa-user"></i>
                              </div>
                            )}
                            <span className="dropdown-username">{currentUser.username}</span>
                          </div>
                          <NavLink 
                            to="/my-recipes" 
                            className="dropdown-item"
                            onClick={() => {
                              setUserDropdownOpen(false)
                              setMobileMenuOpen(false)
                            }}
                          >
                            <i className="fas fa-book"></i>
                            <span>My Recipes</span>
                          </NavLink>
                          <NavLink 
                            to="/profile-picture" 
                            className="dropdown-item"
                            onClick={() => {
                              setUserDropdownOpen(false)
                              setMobileMenuOpen(false)
                            }}
                          >
                            <i className="fas fa-camera"></i>
                            <span>Change Profile Picture</span>
                          </NavLink>
                          <button
                            className="dropdown-item dropdown-item-danger"
                            onClick={handleLogout}
                          >
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )
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
