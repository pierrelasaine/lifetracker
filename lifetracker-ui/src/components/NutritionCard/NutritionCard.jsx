import moment from 'moment'

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

export default function NutritionCard({ nutrition }) {
    const { image_url, name, calories, category, createdAt } = nutrition
    return (
        <div className='nutrition-card'>
            {image_url && (
                <img
                    className='nutrition-image'
                    src={image_url}
                    alt={name}
                />
            )}
            <div className='nutrition-name'>{name}</div>
            <div className='nutrition-calories'>{calories}</div>
            <div className='nutrition-category'>{category}</div>
            <div className='nutrition-date'>{formatDate(createdAt)}</div>
        </div>
    )
}
