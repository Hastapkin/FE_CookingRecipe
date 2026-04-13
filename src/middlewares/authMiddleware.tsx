import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'
import { ROUTES } from '../config/paths'

interface AuthMiddlewareProps {
  children: ReactNode
}

function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  return <>{children}</>
}

export default AuthMiddleware
