import React, { useState } from 'react'
import './LoginForm.css'

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

        const { data, error } = await loginUser({ email, password })
        if (error) setError(error.response.data.error)
    }

    return (
        <div className='login-form'>
            {error && <div className='error'>{error}</div>}
            <section className='form-wrap'>
                <h1>Welcome</h1>
                <div className='form-box'>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor='email'>Email </label><br />
                            <input
                                className='form-input'
                                type='email'
                                name='email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder='something@somewhere.com'
                            />
                        </div>
                        <div>
                            <label htmlFor='password'>Password </label><br />
                            <input
                                className='form-input'
                                type='password'
                                name='password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder='password123'
                            />
                        </div>
                        <div>
                            <button
                                className='submit-login'
                                type='submit'>
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}
