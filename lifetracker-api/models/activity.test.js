/**
 * @fileoverview Test suite for the Activity class of the application.
 * @module models/activity.test
 * @requires ./activity - Activity class containing methods to be tested.
 * @requires ../utils/aux-utils - Auxiliary utility functions.
 * @requires ../db - Database module for data setup and teardown.
 */

const Activity = require('./activity')
const { createUser } = require('../utils/aux-utils')
const db = require('../db')

const knownUser = {
    username: 'mockKnownUsername',
    hashedPassword: process.env.MOCK_HASHED_PASSWORD,
    firstName: 'mockFirstName',
    lastName: 'mockLastName',
    email: 'valid@known.mock'
}

const otherUser = {
    username: 'mockOtherUsername',
    hashedPassword: process.env.MOCK_HASHED_PASSWORD,
    firstName: 'mockFirstName',
    lastName: 'mockLastName',
    email: 'valid@other.mock'
}

describe('Activity', function () {
    beforeAll(async () => {
        await db.query('DELETE FROM nutrition')
        await db.query('DELETE FROM users')
    })

    let userId
    beforeEach(async function () {
        userId = await createUser(knownUser)
        const nutritionData = [
            {
                name: 'mock',
                user_id: userId,
                calories: 100,
                category: 'candy',
                created_at: new Date('2023-12-22')
            },
            {
                name: 'mock',
                user_id: userId,
                calories: 200,
                category: 'drink',
                created_at: new Date('2023-12-22')
            },
            {
                name: 'mock',
                user_id: userId,
                calories: 200,
                category: 'fruit',
                created_at: new Date('2023-12-23')
            },
            {
                name: 'mock',
                user_id: userId,
                calories: 400,
                category: 'dairy',
                created_at: new Date('2023-12-23')
            },
            {
                name: 'mock',
                user_id: userId,
                calories: 400,
                category: 'drink',
                created_at: new Date('2023-12-23')
            },
            {
                name: 'mock',
                user_id: userId,
                calories: 700,
                category: 'fruit',
                created_at: new Date('2023-12-24')
            },
            {
                name: 'mock',
                user_id: userId,
                calories: 100,
                category: 'fruit',
                created_at: new Date('2023-12-24')
            }
        ]

        for (let data of nutritionData) {
            await db.query(
                `INSERT INTO nutrition (user_id, calories, category, created_at, name) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    data.user_id,
                    data.calories,
                    data.category,
                    data.created_at,
                    data.name
                ]
            )
        }
    })

    afterEach(async () => {
        await db.query('DELETE FROM nutrition')
        await db.query('DELETE FROM users')
    })

    afterAll(async () => {
        await db.end()
    })

    describe('calculateDailyCaloriesSummaryStats', function () {
        it('correctly calculates summary statistics per day', async function () {
            const stats = await Activity.calculateDailyCaloriesSummaryStats(
                userId
            )

            expect(stats).toEqual([
                { date: '2023-12-22', totalCaloriesPerDay: 300 },
                { date: '2023-12-23', totalCaloriesPerDay: 1000 },
                { date: '2023-12-24', totalCaloriesPerDay: 800 }
            ])
        })

        it('returns empty array when user has no nutrition entries', async function () {
            userId = await createUser(otherUser)
            
            const stats = await Activity.calculateDailyCaloriesSummaryStats(
                userId
            )

            expect(stats).toEqual([])
        })

        it('only uses the nutrition entries belonging to the user when calculating summary statistics', async function () {
            let stats = await Activity.calculateDailyCaloriesSummaryStats(
                userId
            )

            expect(stats).not.toContainEqual({
                date: '2023-12-25',
                totalCaloriesPerDay: 500
            })
        })
    })

    describe('calculatePerCategoryCaloriesSummaryStats', function () {
        it('correctly calculates average calories per category summary statistics', async function () {
            const stats = await Activity.calculatePerCategoryCaloriesSummaryStats(
                userId
            )

            expect(stats).toEqual([
                { category: 'candy', avgcaloriespercategory: '100.0' },
                { category: 'dairy', avgcaloriespercategory: '400.0' },
                { category: 'drink', avgcaloriespercategory: '300.0' },
                { category: 'fruit', avgcaloriespercategory: '333.3' }
            ])
       })

        it('returns empty array when user has no nutrition entries', async function () {
            userId = await createUser(otherUser)
            const stats = await Activity.calculatePerCategoryCaloriesSummaryStats(
                userId
            )

            expect(stats).toEqual([])
        })

        it('only uses the nutrition entries belonging to the user when calculating summary statistics', async function () {
            const stats = await Activity.calculatePerCategoryCaloriesSummaryStats(
                userId
            )

            expect(stats).not.toContainEqual({
                category: 'meat',
                avgcaloriespercategory: '500.0'
            })
        })
    })
})
