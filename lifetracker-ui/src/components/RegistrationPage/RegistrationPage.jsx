import { useNavigate, Link } from 'react-router-dom'
import RegistrationForm from '../RegistrationForm/RegistrationForm'
import './RegistrationPage.css'

export default function RegistrationPage({ isAuthenticated, setAppState }) {
    const navigate = useNavigate()

    if (isAuthenticated) {
        navigate('/activity')
        return null
    }

    return (
        <div className='registration-page'>
            <RegistrationForm setAppState={setAppState} />
            <p>
                Have an account? <Link to='/login'>Login</Link>
            </p>
        </div>
    )
}
