import { Routes, Route } from 'react-router-dom'
import NutritionOverview from '../NutritionOverview/NutritionOverview'
import NutritionNew from '../NutritionNew/NutritionNew'
import NutritionDetail from '../NutritionDetail/NutritionDetail'
import NotFound from '../NotFound/NotFound'
import './NutritionPage.css'

export default function NutritionPage({ appState, setAppState }) {
    return (
        <div className='nutrition-page'>
            <section className='nutrition-hero'>
                <h1>Nutrition</h1>
            </section>
            <Routes>
                <Route
                    path='/'
                    element={
                        <NutritionOverview
                            appState={appState}
                            setAppState={setAppState}
                        />
                    }
                />
                <Route
                    path='/create'
                    element={<NutritionNew />}
                />
                <Route
                    path='/id/:nutritionId'
                    element={<NutritionDetail />}
                />
                <Route
                    path='*'
                    element={<NotFound />}
                />
            </Routes>
        </div>
    )
}
