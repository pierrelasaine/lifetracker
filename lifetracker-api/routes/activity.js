/**
 * @fileoverview Express router for activity-related operations like fetching user activity and calculating summary stats.
 * @module routes/activity
 * @requires express - Express framework for handling HTTP requests and responses.
 * @requires ../models/activity - The Activity model for database interaction.
 * @requires ../models/users - The User model for fetching user data.
 * @requires ../middleware/security - Middleware for handling security-related operations such as authentication.
 */

const express = require('express')
const Activity = require('../models/activity')
const User = require('../models/users')
const { requireAuthenticatedUser } = require('../middleware/security')

const activityRouter = express.Router()

/**
 * Fetches user's activity stats for the authenticated user.
 * @name getStats
 * @route {GET} /
 * @authentication This route requires authenticated users.
 */
activityRouter.get('/', requireAuthenticatedUser, async (req, res, next) => {
    try {
        const userId = (await User.fetchUserByEmail(res.locals.user.email)).id
        const perDayStats = await Activity.calculateDailyCaloriesSummaryStats(userId)
        const perCategoryStats = await Activity.calculatePerCategoryCaloriesSummaryStats(userId)
        const stats = {
            nutrition: {
                calories: {
                    perDay: perDayStats,
                    perCategory: perCategoryStats
                }
            }
        }

        return res.json({ stats })
    } catch (err) {
        next(err)
    }
})

module.exports = activityRouter
