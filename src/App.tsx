import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import MyOrders from './pages/MyOrders'
import MyRecipes from './pages/MyRecipes'
import ProfilePicture from './pages/ProfilePicture'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe-detail/:id" element={<RecipeDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/profile-picture" element={<ProfilePicture />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
