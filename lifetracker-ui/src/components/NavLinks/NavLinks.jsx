import React from 'react'
import { Link } from 'react-router-dom'
import './NavLinks.css'

/**
 * 
 * @todo
 * update isAuth to false when logging out
 */

export default function NavLinks({ user, setUser }) {
    const logoutUser = () => {
        localStorage.removeItem('lifetracker_token')
        setUser(null)
        window.location.reload()
    }

    return (
        <>
            <section className='nav-links'>
                <Link to='/activity'>
                    <div className='link'>Activity</div>
                </Link>
                <Link to='/nutrition'>
                    <div className='link'>Nutrition</div>
                </Link>
                {/* Add more routes */}
            </section>
            {user ? (
                <button
                    className='signin'
                    onClick={logoutUser}>
                    Logout
                </button>
            ) : (
                <div className='nav-buttons'>
                    <Link to='/login'>
                        <button className='signin'>Sign In</button>
                    </Link>
                    <Link to='/register'>
                        <button className='register'>Register</button>
                    </Link>
                </div>
            )}
        </>
    )
}
