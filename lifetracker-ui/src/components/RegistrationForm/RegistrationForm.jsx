import { useState } from 'react'
import ApiClient from '../../../../services/apiClient'

/**
 * @todo error handling
 * README 187-189
 */

export default function RegistrationForm() {
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

    const handleSubmit = async (event) => {
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
            try {
                await ApiClient.register(registrationData)
            } catch (error) {
                setErrors({
                    ...errors,
                    form: error.response.data.message
                })
            }
        }
    }

    return (
        <div className='registration-form'>
            <form onSubmit={handleSubmit}>
                <label htmlFor='email'>Email</label>
                <input
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleInputChange}
                    className='form-input'
                    placeholder='Email'
                />
                {errors.email && <div className='error'>{errors.email}</div>}
                <label htmlFor='username'>Username</label>
                <input
                    name='username'
                    type='text'
                    value={form.username}
                    onChange={handleInputChange}
                    className='form-input'
                    placeholder='Username'
                />
                <label htmlFor='firstName'>First Name</label>
                <input
                    name='firstName'
                    type='text'
                    value={form.firstName}
                    onChange={handleInputChange}
                    className='form-input'
                    placeholder='First Name'
                />
                <label htmlFor='lastName'>Last Name</label>
                <input
                    name='lastName'
                    type='text'
                    value={form.lastName}
                    onChange={handleInputChange}
                    className='form-input'
                    placeholder='Last Name'
                />
                <label htmlFor='password'>Password</label>
                <input
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={handleInputChange}
                    className='form-input'
                    placeholder='Password'
                />
                <label htmlFor='passwordConfirm'>Confirm Password</label>
                <input
                    name='passwordConfirm'
                    type='password'
                    value={form.passwordConfirm}
                    onChange={handleInputChange}
                    className='form-input'
                    placeholder='Confirm Password'
                />
                {errors.passwordConfirm && (
                    <div className='error'>{errors.passwordConfirm}</div>
                )}
                <button
                    className='submit-registration'
                    type='submit'>
                    Create Account
                </button>
            </form>
        </div>
    )
}
