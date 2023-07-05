import React from 'react'
import { Link } from 'react-router-dom'
import NavLinks from '../NavLinks/NavLinks'

export default function Navbar({ user, setUser }) {
    return (
        <nav className='navbar'>
            <div className='logo'>
                <Link to='/'>App Logo</Link>
            </div>
            <NavLinks
                user={user}
                setUser={setUser}
            />
        </nav>
    )
}
