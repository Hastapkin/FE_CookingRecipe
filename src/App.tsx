// React import not required with react-jsx runtime
import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <div>
      <header className="header">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              <NavLink to="/">
                <i className="fas fa-utensils"></i>
                <span>Cooking Recipe</span>
              </NavLink>
            </div>
            <ul className="nav-menu">
              <li className="nav-item"><NavLink to="/" end className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Home</NavLink></li>
              <li className="nav-item"><NavLink to="/recipes" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Recipes</NavLink></li>
              <li className="nav-item"><NavLink to="/about" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>About</NavLink></li>
              <li className="nav-item"><NavLink to="/contact" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Contact</NavLink></li>
            </ul>
            <div className="nav-auth">
              <a href="#" className="btn btn-outline" id="loginBtn">Login</a>
              <a href="#" className="btn btn-primary" id="registerBtn">Register</a>
            </div>
            <div className="nav-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipe-detail" element={<RecipeDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© 2024 Cooking Recipe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

