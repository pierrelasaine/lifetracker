import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '../LandingPage/LandingPage'
import LoginPage from '../LoginPage/LoginPage'
import RegistrationPage from '../RegistrationPage/RegistrationPage'
import ActivityPage from '../ActivityPage/ActivityPage'
import NutritionPage from '../NutritionPage/NutritionPage'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import NotFound from '../NotFound/NotFound'
import Navbar from '../Navbar/Navbar'
import ApiClient from '../../../../services/apiClient'
import './App.css'

/**
 * @todo
 * update navbar pass appstate to navlinks
 */

export default function App() {
    const [appState, setAppState] = useState({
        user: null,
        isAuthenticated: false,
        nutrition: [],
        sleep: [],
        exercise: []
    })

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('lifetracker_token')
            if (token) {
                ApiClient.setToken(token)
                const { data } = await ApiClient.fetchUserFromToken()
                if (data) {
                    setAppState(prevState => ({
                        ...prevState,
                        user: data.user,
                        nutrition: data.nutrition,
                        isAuthenticated: true,
                        token: token
                    }))
                }
            }
        }
        fetchUser()
    }, [appState.isAuthenticated])

    return (
        <div className='App'>
            <BrowserRouter>
                <Navbar
                    user={appState.user}
                    setUser={setAppState}
                />
                <section className='app-body'>
                    <Routes>
                        <Route
                            path='/'
                            element={<LandingPage />}
                        />
                        <Route
                            path='/login'
                            element={<LoginPage setAppState={setAppState} />}
                        />
                        <Route
                            path='/register'
                            element={
                                <RegistrationPage
                                    isAuthenticated={appState.isAuthenticated}
                                    setAppState={setAppState}
                                />
                            }
                        />
                        <Route
                            path='/activity'
                            element={
                                <ProtectedRoute
                                    element={
                                        <ActivityPage
                                            appState={appState}
                                            setAppState={setAppState}
                                        />
                                    }
                                    appState={appState}
                                    fallback={
                                        <LoginPage
                                            message='Please login to view this page'
                                            setAppState={setAppState}
                                        />
                                    }
                                />
                            }
                        />
                        <Route
                            path='/nutrition/*'
                            element={
                                <ProtectedRoute
                                    element={
                                        <NutritionPage
                                            appState={appState}
                                            setAppState={setAppState}
                                        />
                                    }
                                    appState={appState}
                                    fallback={
                                        <LoginPage
                                            message='Please login to view this page'
                                            setAppState={setAppState}
                                        />
                                    }
                                />
                            }
                        />
                        <Route
                            path='*'
                            element={<NotFound />}
                        />
                    </Routes>
                </section>
            </BrowserRouter>
        </div>
    )
}
