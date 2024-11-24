import React from 'react'
import {Navigate, Outlet} from 'react-router-dom'

interface PrivateRouteProps {
  component: React.ComponentType
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({component: Component}) => {
  const isAuthenticated = () => {
    return sessionStorage.getItem('token') !== null
  }

  // 인증된 경우 컴포넌트를 렌더링
  return isAuthenticated() ? <Component /> : <Navigate to="/login" replace />
}

export default PrivateRoute
