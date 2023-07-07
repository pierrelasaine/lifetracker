import { useState } from 'react'
import ApiClient from '../../../services/apiClient'

export default function NutritionForm() {
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        calories: '',
        imageUrl: '',
        category: ''
    })

    const handleFormSubmit = async e => {
        e.preventDefault()
        try {
            const success = await ApiClient.addNutritionEntry({
                name: formData.name,
                category: formData.category,
                calories: formData.calories,
                image_url: formData.imageUrl
            })
            if (success) {
                setFormData({
                    name: '',
                    calories: '',
                    imageUrl: '',
                    category: ''
                })
            }
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <form
            className='nutrition-form'
            onSubmit={handleFormSubmit}>
            {error && <div className='error'>{error}</div>}
            <input
                className='form-input'
                type='text'
                name='name'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder='Name'
            />
            <input
                className='form-input'
                type='number'
                name='calories'
                value={formData.calories}
                onChange={e => setFormData({ ...formData, calories: e.target.value })}
                placeholder='Calories'
            />
            <input
                className='form-input'
                type='text'
                name='imageUrl'
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder='Image URL'
            />
            <input
                className='form-input'
                type='text'
                name='category'
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder='Category'
            />
            <button
                className='submit-nutrition'
                type='submit'>
                Save
            </button>
        </form>
    )
}
