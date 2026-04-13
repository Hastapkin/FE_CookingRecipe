import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getUserSession } from '../services/auth'
import { ROUTES } from '../config/paths'

interface AdminMiddlewareProps {
  children: ReactNode
}

function AdminMiddleware({ children }: AdminMiddlewareProps) {
  const location = useLocation()
  const session = getUserSession()

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  const isAdmin = (session.user.role || '').toLowerCase() === 'admin'
  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}

export default AdminMiddleware
