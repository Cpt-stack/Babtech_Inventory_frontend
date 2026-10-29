import React from 'react'
import { Navigate } from 'react-router-dom'
import { isTechnician } from '../utils/auth'

function ProtectedRoute({children}) {
    if(!isTechnician){
        return <Navigate to="/equipment" replace/>
    }
  return children
}

export default ProtectedRoute