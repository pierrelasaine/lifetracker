import { useEffect, useState } from 'react'
import NutritionCard from '../NutritionCard/NutritionCard'
import ApiClient from '../../../services/apiClient'

export default function NutritionFeed() {
    const [nutritions, setNutritions] = useState()
    useEffect(() => {
        const getNutritions = async () => {
            const response = await ApiClient.fetchNutritionList()
            setNutritions(response.data.nutritions)
        }

        getNutritions()
    }, [])

    return (
        <div className='nutrition-feed'>
            {nutritions?.length === 0 ? (
                <div className='empty-message'>Nothing here yet</div>
            ) : (
                nutritions?.map(nutrition => (
                    <NutritionCard
                        key={nutrition.id}
                        nutrition={nutrition}
                    />
                ))
            )}
        </div>
    )
}
