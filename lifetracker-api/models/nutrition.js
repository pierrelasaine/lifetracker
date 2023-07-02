/**
 * @fileoverview A Nutrition model for managing nutrition data in a Node.js application.
 * @module models/Nutrition
 * @requires module:../db - Database access module.
 * @requires module:../utils/errors - Error classes for exception handling.
 */

const { BadRequestError, NotFoundError } = require('../utils/errors')
const db = require('../db')

class Nutrition {
    /**
     * @function createNutrition
     * @description Creates a new nutrition entry in the database.
     * @param {Object} data - Contains name, category, calories, image_url, and user_id for the new nutrition entry.
     * @param {string} data.name - Name of the nutrition entry.
     * @param {string} data.category - Category of the nutrition entry.
     * @param {number} data.calories - Calories of the nutrition entry.
     * @param {string} data.image_url - Image URL of the nutrition entry.
     * @param {number} data.user_id - User ID associated with the nutrition entry.
     * @returns {Promise<Object>} The newly created nutrition entry.
     * @throws {BadRequestError} If any required field is missing or invalid.
     */
    static async createNutrition({
        name,
        category,
        calories,
        image_url,
        user_id
    }) {
        if (!name || !category || !calories || !image_url || !user_id)
            throw new BadRequestError('Missing required field.')

        const query = `
            INSERT INTO nutrition (name, category, calories, image_url, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, category, calories, image_url, user_id
        `
        const {
            rows: [nutrition]
        } = await db.query(query, [
            name,
            category,
            calories,
            image_url,
            user_id
        ])

        return nutrition
    }

    /**
     * @function fetchNutritionById
     * @description Retrieves a specific nutrition entry by id from the database.
     * @param {number} id - ID of the nutrition entry.
     * @returns {Promise<Object>} The fetched nutrition entry.
     * @throws {BadRequestError} If the id is missing or invalid.
     * @throws {NotFoundError} If no nutrition entry is found with the provided id.
     */
    static async fetchNutritionById(id) {
        if (!id) throw new BadRequestError('Invalid or missing id.')

        const query = `
            SELECT id, name, category, calories, image_url, user_id
            FROM nutrition
            WHERE id = $1
        `
        const {
            rows: [nutrition]
        } = await db.query(query, [id])

        if (!nutrition)
            throw new NotFoundError(`No nutrition found with id ${id}`)

        return nutrition
    }

    /**
     * @function listNutritionForUser
     * @description Lists all nutrition entries for a specific user.
     * @param {number} user_id - ID of the user.
     * @returns {Promise<Array>} List of nutrition entries for the user.
     * @throws {BadRequestError} If the user_id is missing or invalid.
     */
    static async listNutritionForUser(user_id) {
        if (!user_id) throw new BadRequestError('Invalid or missing user id.')

        const query = `
            SELECT id, name, category, calories, image_url, user_id
            FROM nutrition
            WHERE user_id = $1
        `
        const { rows: nutritionList } = await db.query(query, [user_id])

        return nutritionList
    }
}

module.exports = Nutrition
