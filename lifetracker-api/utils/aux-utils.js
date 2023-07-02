const db = require('../db')

const createUser = async (user) => {
    const {
        rows: [{ id: userId }]
    } = await db.query(
        `
        INSERT INTO users (username, password, first_name, last_name, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [
            user.username,
            user.hashedPassword,
            user.firstName,
            user.lastName,
            user.email
        ]
    )

    return userId
}

const createEntry = async (entry, userId) => {
    const {
        rows: [{ id: nutritionId }]
    } = await db.query(
        `
        INSERT INTO nutrition (name, category, calories, image_url, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [entry.name, entry.category, entry.calories, entry.image_url, userId]
    )

    return nutritionId
}

module.exports = {
    createUser,
    createEntry
}

/**
 * @todo make tests and docstrings for this
 */