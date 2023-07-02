/**
 * @fileoverview Express router for nutrition-related operations like fetching, creating, and validating nutrition entries.
 * @module routes/nutrition
 * @requires express - Express framework for handling HTTP requests and responses.
 * @requires ../models/nutrition - The Nutrition model for database interaction.
 * @requires ../models/users - The User model for fetching user data.
 * @requires ../middleware/security - Middleware for handling security-related operations such as authentication.
 * @requires ../middleware/permissions - Middleware for handling permission-related operations such as ownership verification.
 */

const express = require('express')
const Nutrition = require('../models/nutrition')
const User = require('../models/users')
const { requireAuthenticatedUser } = require('../middleware/security')
const { authedUserOwnsNutrition } = require('../middleware/permissions')

const nutritionRouter = express.Router()

/**
 * Fetches all nutrition entries for the authenticated user.
 * @name listNutrition
 * @route {GET} /
 * @authentication This route requires authenticated users.
 */
nutritionRouter.get('/', requireAuthenticatedUser, async (req, res, next) => {
    try {
        const userId = (await User.fetchUserByEmail(res.locals.user.email)).id
        const nutritions = await Nutrition.listNutritionForUser(userId)

        return res.status(200).json({ nutritions })
    } catch (err) {
        next(err)
    }
})

/**
 * Creates a new nutrition entry for the authenticated user.
 * @name createNutrition
 * @route {POST} /
 * @authentication This route requires authenticated users.
 * @bodyparam {Object} nutrition - Nutrition entry data.
 */
nutritionRouter.post('/', requireAuthenticatedUser, async (req, res, next) => {
    try {
        const userId = (await User.fetchUserByEmail(res.locals.user.email)).id
        const { name, category, calories, image_url } = req.body.nutrition

        const entry = await Nutrition.createNutrition({
            name,
            category,
            calories,
            image_url,
            user_id: userId
        })

        return res.status(201).json({ nutrition: entry })
    } catch (err) {
        next(err)
    }
})

/**
 * Fetches a specific nutrition entry if the authenticated user owns it.
 * @name fetchNutrition
 * @route {GET} /:nutritionId
 * @authentication This route requires authenticated users and ownership of the nutrition entry.
 * @routeparam {string} :nutritionId - ID of the nutrition entry.
 */
nutritionRouter.get(
    '/:nutritionId',
    requireAuthenticatedUser,
    authedUserOwnsNutrition,
    async (req, res, next) => {
        try {
            const nutrition = await Nutrition.fetchNutritionById(
                req.params.nutritionId
            )

            return res.status(200).json({ nutrition })
        } catch (err) {
            next(err)
        }
    }
)

module.exports = nutritionRouter
