import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Login from './pages/Login'
import MyOrders from './pages/MyOrders'
import MyRecipes from './pages/MyRecipes'
import NotFound from './pages/NotFound'
import ProfilePicture from './pages/ProfilePicture'
import RecipeDetail from './pages/RecipeDetail'
import Recipes from './pages/Recipes'
import Register from './pages/Register'
import AdminRecipeDetail from './pages/admin/AdminRecipeDetail'
import AdminRecipeEditor from './pages/admin/AdminRecipeEditor'
import AdminRecipes from './pages/admin/AdminRecipes'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminMiddleware from './middlewares/adminMiddleware'
import AuthMiddleware from './middlewares/authMiddleware'
import { ROUTES } from './config/paths'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.RECIPES} element={<Recipes />} />
        <Route path={ROUTES.RECIPE_DETAIL} element={<RecipeDetail />} />

        <Route path={ROUTES.CART} element={<AuthMiddleware><Cart /></AuthMiddleware>} />
        <Route path={ROUTES.CHECKOUT} element={<AuthMiddleware><Checkout /></AuthMiddleware>} />
        <Route path={ROUTES.CHECKOUT_SUCCESS} element={<AuthMiddleware><CheckoutSuccess /></AuthMiddleware>} />
        <Route path={ROUTES.MY_ORDERS} element={<AuthMiddleware><MyOrders /></AuthMiddleware>} />
        <Route path={ROUTES.MY_RECIPES} element={<AuthMiddleware><MyRecipes /></AuthMiddleware>} />
        <Route path={ROUTES.PROFILE_PICTURE} element={<AuthMiddleware><ProfilePicture /></AuthMiddleware>} />

        <Route path={ROUTES.ADMIN_RECIPES} element={<AdminMiddleware><AdminRecipes /></AdminMiddleware>} />
        <Route path={ROUTES.ADMIN_RECIPE_NEW} element={<AdminMiddleware><AdminRecipeEditor /></AdminMiddleware>} />
        <Route path={ROUTES.ADMIN_RECIPE_EDIT} element={<AdminMiddleware><AdminRecipeEditor /></AdminMiddleware>} />
        <Route path={ROUTES.ADMIN_RECIPE_DETAIL} element={<AdminMiddleware><AdminRecipeDetail /></AdminMiddleware>} />
        <Route path={ROUTES.ADMIN_TRANSACTIONS} element={<AdminMiddleware><AdminTransactions /></AdminMiddleware>} />

        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
