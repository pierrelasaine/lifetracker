/**
 * @fileoverview Class providing functions to calculate daily and per-category calorie summary stats.
 * @module models/Activity
 * @requires ../db - Database module for querying.
 */

const db = require('../db')

class Activity {
    /**
     * @method calculateDailyCaloriesSummaryStats
     * @description Fetches and calculates the daily calorie intake of a specific user.
     * @param {Number} userId - User ID for which to fetch the stats.
     * @returns {Object[]} - Array of objects with date and total daily calories consumed.
     * @throws {Error} - Throws an error if database query fails.
     */
    static async calculateDailyCaloriesSummaryStats(userId) {
        const { rows: data } = await db.query(
            `
            SELECT (DATE(created_at) AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' as date,
            SUM(calories) as totalcaloriesperday 
            FROM nutrition 
            WHERE user_id = $1 
            GROUP BY date 
            ORDER BY date;
            `,
            [userId]
        )

        return data.map(stat => ({
            date: stat.date.toISOString().split('T')[0],
            totalCaloriesPerDay: parseInt(stat.totalcaloriesperday)
        }))
    }

    /**
     * @method calculatePerCategoryCaloriesSummaryStats
     * @description Fetches and calculates the average calorie intake per category for a specific user.
     * @param {Number} userId - User ID for which to fetch the stats.
     * @returns {Object[]} - Array of objects with category and average calories consumed per category.
     * @throws {Error} - Throws an error if database query fails.
     */
    static async calculatePerCategoryCaloriesSummaryStats(userId) {
        const { rows: data } = await db.query(
            `
            SELECT category, ROUND(AVG(calories), 1) as avgcaloriespercategory 
            FROM nutrition 
            WHERE user_id = $1 
            GROUP BY category
            ORDER BY category;
            `,
            [userId]
        )
        
        return data
    }
}

module.exports = Activity
