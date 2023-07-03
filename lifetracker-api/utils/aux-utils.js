const db = require('../db')

const DATE = new Date('2023-12-23')

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
        INSERT INTO nutrition (name, category, calories, image_url, user_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `,
        [entry.name, entry.category, entry.calories, entry.image_url, userId, DATE]
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