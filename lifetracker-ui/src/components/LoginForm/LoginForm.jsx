import React, { useState } from 'react'

export default function LoginForm({ loginUser }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async e => {
        e.preventDefault()
        setError(null)

        if (!email.includes('@')) {
            setError('Not a valid email address.')
            return
        } // use regex to validate email

        try {
            await loginUser({ email, password })
        } catch (error) {
            if (error.response.status === 401) {
                setError('Email and password combination is incorrect.')
            } else if ([400, 422].includes(error.response.status)) {
                setError('Something went wrong. Please try again.')
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        }
    }

    return (
        <div className='login-form'>
            {error && <div className='error'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    className='form-input'
                    type='email'
                    name='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Email'
                />

                <input
                    className='form-input'
                    type='password'
                    name='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Password'
                />

                <button
                    className='submit-login'
                    type='submit'>
                    Login
                </button>
            </form>
        </div>
    )
}
