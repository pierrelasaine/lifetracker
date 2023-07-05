import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NutritionCard from '../NutritionCard/NutritionCard'
import NotFound from '../NotFound/NotFound'
import ApiClient from '../../../../services/apiClient'
import Loading from '../Loading/Loading'

export default function NutritionDetail() {
    const { nutritionId } = useParams()
    const [nutrition, setNutrition] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ApiClient.fetchNutritionEntry(nutritionId)
                setNutrition(response.data)
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch nutrition:', error)
                setLoading(false)
            }
        }
        fetchData()
    }, [nutritionId])

    return (
        <div className='nutrition-detail'>
            {loading ? (
                <Loading />
            ) : nutrition ? (
                <NutritionCard nutrition={nutrition} />
            ) : (
                <NotFound />
            )}
        </div>
    )
}
