import { useNavigate } from 'react-router-dom'
import RegistrationForm from '../RegistrationForm/RegistrationForm'

export default function RegistrationPage({ isAuthenticated, setAppState }) {
    const navigate = useNavigate()

    if (isAuthenticated) {
        navigate('/activity')
        return null
    }

    return (
        <div className='registration-page'>
            <RegistrationForm />
        </div>
    )
}
