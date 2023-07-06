import { Link } from 'react-router-dom'
import NutritionFeed from '../NutritionFeed/NutritionFeed'
import Loading from '../Loading/Loading'
import './NutritionOverview.css'

export default function NutritionOverview({ appState, setAppState }) {
    const { error, isLoading } = appState

    return (
        <div className='nutrition-overview'>
            {error && <div className='error'>{error}</div>}
            <Link to='/nutrition/create'>
                <button>Record Nutrition</button>
            </Link>
            {isLoading ? <Loading /> : <NutritionFeed />}
        </div>
    )
}
