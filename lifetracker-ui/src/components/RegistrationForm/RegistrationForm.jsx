import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ApiClient from '../../../../services/apiClient'
import './RegistrationForm.css'

/**
 * @todo error handling
 * README 187-189
 */

export default function RegistrationForm({ setAppState }) {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        passwordConfirm: ''
    })

    const [errors, setErrors] = useState({})

    const handleInputChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()
        const email = form.email.trim()
        if (form.password !== form.passwordConfirm) {
            setErrors({
                ...errors,
                passwordConfirm: "Passwords don't match"
            })
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors({
                ...errors,
                email: 'Email address is invalid'
            })
        } else {
            const { passwordConfirm, ...registrationData } = form
            const { data, error } = await ApiClient.register(registrationData)
            if (data) {
                setAppState(prevState => ({
                    ...prevState,
                    user: data.user,
                    isAuthenticated: true,
                    token: data.token
                }))
                localStorage.setItem('lifetracker_token', data.token)
                navigate('/activity')
            } else {
                setErrors({
                    ...errors,
                    error: error.message
                })
            }
        }
    }

    return (
        <div className='registration-form'>
            <section className='rform-wrap'>
                <h1>Create an Account</h1>
                <div className='rform-box'>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor='email'>Email</label>
                            <br />
                            <input
                                name='email'
                                type='email'
                                value={form.email}
                                onChange={handleInputChange}
                                className='form-input'
                                placeholder='something@somewhere.com'
                            />
                        </div>
                        <div>
                            <label htmlFor='username'>Username</label>
                            <br />
                            <input
                                name='username'
                                type='text'
                                value={form.username}
                                onChange={handleInputChange}
                                className='form-input'
                                placeholder='trackme123'
                            />
                        </div>
                        <div className='name'>
                            <section>
                                <label htmlFor='firstName'>First Name</label>
                                <br />
                                <input
                                    name='firstName'
                                    type='text'
                                    value={form.firstName}
                                    onChange={handleInputChange}
                                    className='rname'
                                    placeholder='Joe'
                                />
                            </section>
                            <section>
                                <label htmlFor='lastName'>Last Name</label>
                                <br />
                                <input
                                    name='lastName'
                                    type='text'
                                    value={form.lastName}
                                    onChange={handleInputChange}
                                    className='rname'
                                    placeholder='Shmoe'
                                />
                            </section>
                        </div>
                        <div>
                            <label htmlFor='password'>Password</label>
                            <br />
                            <input
                                name='password'
                                type='password'
                                value={form.password}
                                onChange={handleInputChange}
                                className='form-input'
                                placeholder='password123'
                            />
                        </div>
                        <div>
                            <label htmlFor='passwordConfirm'>
                                Confirm Password
                            </label>
                            <br />
                            <input
                                name='passwordConfirm'
                                type='password'
                                value={form.passwordConfirm}
                                onChange={handleInputChange}
                                className='form-input'
                                placeholder='password123'
                            />
                        </div>
                        <div>
                            <button
                                className='submit-registration'
                                type='submit'>
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {errors.email && <div className='error'>{errors.email}</div>}

            {errors.passwordConfirm && (
                <div className='error'>{errors.passwordConfirm}</div>
            )}

            {errors.form && <div className='error'>{errors.form}</div>}
        </div>
    )
}
