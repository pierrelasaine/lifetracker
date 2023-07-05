import React from 'react'
import { Link } from 'react-router-dom'

export default function NavLinks({ user, setUser }) {
    const logoutUser = () => {
        localStorage.removeItem('lifetracker_token')
        setUser(null)
        window.location.reload()
    }

    return (
        <div className='nav-links'>
            <Link to='/activity'>Activity</Link>
            <Link to='/nutrition'>Nutrition</Link>
            {/* Add more routes */}

            {user ? (
                <button
                    className='logout-button'
                    onClick={logoutUser}>
                    Logout
                </button>
            ) : (
                <>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>Sign Up</Link>
                </>
            )}
        </div>
    )
}
