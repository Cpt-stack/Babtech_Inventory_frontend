import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAdmin, isTechnician , getCurrentUser  } from '../utils/auth'

function ProtectedRoute({children}) {
  const user = getCurrentUser()
    if(!isTechnician && !isAdmin){
        return <Navigate to="/equipment" replace/>
    }

    if(!user){
      return <Navigate to ="/login" replace/>
    }
  return children
}

export default ProtectedRoute