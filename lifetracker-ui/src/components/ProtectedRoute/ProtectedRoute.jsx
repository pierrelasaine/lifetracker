import React from 'react'
import { Route, Navigate } from 'react-router-dom'

export default function ProtectedRoute({
    element,
    isAuthenticated,
    fallback,
    ...rest
}) {
    return (
        <Route
            {...rest}
            element={
                isAuthenticated ? element : fallback || <Navigate to='/login' />
            }
        />
    )
}
