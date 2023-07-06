import React from 'react'
import { Route, Navigate } from 'react-router-dom'

export default function ProtectedRoute({ element, appState, fallback }) {
    const isAuthenticated = appState.isAuthenticated

    return isAuthenticated ? element : fallback || <Navigate to='/login' />
}
