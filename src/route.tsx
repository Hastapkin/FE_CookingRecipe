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
import MyCourses from './pages/MyCourses'
import NotFound from './pages/NotFound'
import ProfilePicture from './pages/ProfilePicture'
import CourseDetail from './pages/CourseDetail'
import CourseLearn from './pages/CourseLearn'
import Courses from './pages/Courses'
import Register from './pages/Register'
import AdminCourseDetail from './pages/admin/AdminCourseDetail'
import AdminCourseEditor from './pages/admin/AdminCourseEditor'
import AdminCourses from './pages/admin/AdminCourses'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminMiddleware from './middlewares/adminMiddleware'
import AuthMiddleware from './middlewares/authMiddleware'
import { ROUTES } from './config/paths'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.COURSES} element={<Courses />} />
        <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetail />} />
        <Route path={ROUTES.COURSE_LEARN} element={<AuthMiddleware><CourseLearn /></AuthMiddleware>} />

        <Route path={ROUTES.CART} element={<AuthMiddleware><Cart /></AuthMiddleware>} />
        <Route path={ROUTES.CHECKOUT} element={<AuthMiddleware><Checkout /></AuthMiddleware>} />
        <Route path={ROUTES.CHECKOUT_SUCCESS} element={<AuthMiddleware><CheckoutSuccess /></AuthMiddleware>} />
        <Route path={ROUTES.MY_ORDERS} element={<AuthMiddleware><MyOrders /></AuthMiddleware>} />
        <Route path={ROUTES.MY_COURSES} element={<AuthMiddleware><MyCourses /></AuthMiddleware>} />
        <Route path={ROUTES.PROFILE_PICTURE} element={<AuthMiddleware><ProfilePicture /></AuthMiddleware>} />

        <Route path={ROUTES.ADMIN_COURSES} element={<AdminMiddleware><AdminCourses /></AdminMiddleware>} />
        <Route path={ROUTES.ADMIN_COURSE_NEW} element={<AdminMiddleware><AdminCourseEditor /></AdminMiddleware>} />
        <Route path={ROUTES.ADMIN_COURSE_EDIT} element={<AdminMiddleware><AdminCourseEditor /></AdminMiddleware>} />
        <Route path={ROUTES.ADMIN_COURSE_DETAIL} element={<AdminMiddleware><AdminCourseDetail /></AdminMiddleware>} />
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
