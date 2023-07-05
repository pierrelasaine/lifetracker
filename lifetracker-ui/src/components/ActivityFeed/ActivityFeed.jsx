import { useEffect, useState } from 'react'
import moment from 'moment'

import ApiClient from '../../../../services/apiClient'
import Loading from '../Loading/Loading'
import SummaryStat from '../SummaryStat/SummaryStat'

export default function ActivityFeed() {
    const [stats, setStats] = useState()

    const formatDate = createdAt => {
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]
        const dateObject = moment(createdAt)
        let day = dateObject.date()
        day = String(day).padStart(2, '0')
        const month = monthNames[dateObject.month()]
        const year = dateObject.year()
    
        createdAt = `${day} ${month} ${year}`
    
        return createdAt
    }

    useEffect(() => {
        const fetchActivityStats = async () => {
            const response = await ApiClient.fetchActivityStats()
            setStats(response.data.stats)
        }

        fetchActivityStats()
    }, [])

    if (!stats) {
        return <Loading />
    }

    const {
        nutrition: {
            calories: {
                perCategory: avgCaloriesPerCategory,
                perDay: totalCaloriesPerDay
            }
        }
    } = stats

    if (avgCaloriesPerCategory.length === 0 || totalCaloriesPerDay.length === 0) {
        return <h4>No info to display!</h4>
    }

    return (
        <div className='activity-feed'>
            <div className='per-category'>
                <h4>Average Calories Per Category</h4>
                {avgCaloriesPerCategory?.slice(0, 6).map((item, index) => (
                    <SummaryStat
                        key={index}
                        stat={Math.floor(item.avgcaloriespercategory * 10) / 10}
                        label='Calories'
                        substat={item.category}
                    />
                ))}
            </div>

            <div className='per-day'>
                <h4>Total Calories Per Day</h4>
                {totalCaloriesPerDay?.map((item, index) => (
                    <SummaryStat
                        key={index}
                        stat={Math.floor(item.totalCaloriesPerDay)}
                        label='Calories'
                        substat={formatDate(item.date)}
                    />
                ))}
            </div>
        </div>
    )
}
