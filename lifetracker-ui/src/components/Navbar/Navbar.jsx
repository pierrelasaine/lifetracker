import React from 'react'
import { Link } from 'react-router-dom'
import NavLinks from '../NavLinks/NavLinks'
import './Navbar.css'

export default function Navbar({ user, setUser }) {
    return (
        <nav className='navbar'>
            <div className='logo'>
                <Link to='/'>
                    <img
                        src='https://lifetracker.up.railway.app/assets/codepath-f1b3e41a.svg'
                        alt='logo'
                    />
                </Link>
            </div>
            <NavLinks
                user={user}
                setUser={setUser}
            />
        </nav>
    )
}
