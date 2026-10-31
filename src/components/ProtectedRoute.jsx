import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAdmin, isTechnician } from '../utils/auth'

function ProtectedRoute({children}) {
    if(!isTechnician && !isAdmin){
        return <Navigate to="/equipment" replace/>
    }
  return children
}

export default ProtectedRoute