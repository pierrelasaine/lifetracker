import { useNavigate } from 'react-router-dom'
import LoginForm from '../LoginForm/LoginForm'
import ApiClient from '../../../../services/apiClient'

export default function LoginPage({ setAppState, message }) {
    const navigate = useNavigate()

    const loginUser = async credentials => {
        const { data, error } = await ApiClient.login(credentials)
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
            throw new Error(error)
        }
    }

    return (
        <div className='login-page'>
            {message && <p>{message}</p>}
            <LoginForm loginUser={loginUser} />
        </div>
    )
}
