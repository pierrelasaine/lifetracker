import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '../LandingPage/LandingPage'
import LoginPage from '../LoginPage/LoginPage'
import RegistrationPage from '../RegistrationPage/RegistrationPage'
import ActivityPage from '../ActivityPage/ActivityPage'
import NutritionPage from '../NutritionPage/NutritionPage'
import NotFound from '../NotFound/NotFound'
import Navbar from '../Navbar/Navbar'
import ApiClient from '../../../../services/apiClient'

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
                        isAuthenticated: !!data.user,
                        nutrition: data.nutrition,
                        sleep: data.sleep,
                        exercise: data.exercise,
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
                            appState.isAuthenticated ? (
                                <ActivityPage
                                    appState={appState}
                                    setAppState={setAppState}
                                />
                            ) : (
                                <LoginPage
                                    message='Please login to view this page'
                                    setAppState={setAppState}
                                />
                            )
                        }
                    />
                    <Route
                        path='/nutrition/*'
                        element={
                            appState.isAuthenticated ? (
                                <NutritionPage
                                    appState={appState}
                                    setAppState={setAppState}
                                />
                            ) : (
                                <LoginPage
                                    message='Please login to view this page'
                                    setAppState={setAppState}
                                />
                            )
                        }
                    />
                    <Route
                        path='*'
                        element={<NotFound />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
