import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateFeature({children}) {
    const {currentUser} = useAuth();
  return (
    currentUser ? children : null
  )
}