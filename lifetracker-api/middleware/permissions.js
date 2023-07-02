/**
 * @fileoverview Middleware for authentication and authorization purposes.
 * Ensures that the authenticated user owns the nutrition data they are trying to access.
 * @module middleware/permissions
 * @requires ../utils/errors - Error classes for exception handling.
 * @requires ../models/nutrition - Nutrition data model.
 * @requires ../models/user - User data model.
 */

const { ForbiddenError, NotFoundError } = require('../utils/errors')
const Nutrition = require('../models/nutrition')
const User = require('../models/users')

/**
 * @description Middleware to check if the authenticated user is the owner of the nutrition data they are trying to access.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {NotFoundError} If the nutrition data isn't found.
 * @throws {ForbiddenError} If the authenticated user is not the owner of the nutrition data.
 * @returns {undefined} The function doesn't return a value.
 */
const authedUserOwnsNutrition = async (req, res, next) => {
    try {
        const id = req.params.nutritionId
        const nutrition = await Nutrition.fetchNutritionById(id)
        const { email: email } = res.locals.user
        const { id: userId } = await User.fetchUserByEmail(email)

        if (!nutrition) throw new NotFoundError()
        if (nutrition.user_id !== userId) throw new ForbiddenError()

        res.locals.nutrition = nutrition
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = {
    authedUserOwnsNutrition
}
