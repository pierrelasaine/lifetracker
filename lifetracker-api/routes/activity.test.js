/**
 * @fileoverview Testing of /activity routes.
 * @module tests/activityRoutes
 * @requires supertest - HTTP assertions made easy via SuperTest.
 * @requires ../app - Main Express application.
 * @requires ../db - Database interaction module.
 * @requires ../utils/aux-utils - Auxiliary utilities for creating mock users and entries.
 * @requires ../utils/tokens - Token utilities module for generating user tokens.
 * @requires ../config - Configuration module containing the secret key for token creation.
 */

const request = require('supertest')
const app = require('../app')
const db = require('../db')
const { createUser, createEntry } = require('../utils/aux-utils')
const { createToken } = require('../utils/tokens')
const { SECRET_KEY } = require('../config')

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

const entry = {
    name: 'Apple',
    category: 'Fruit',
    calories: 100,
    image_url: 'http://example.com'
}

let userId, userToken, nutritionId

describe('GET /activity', function () {
    beforeEach(async () => {
        userId = await createUser(knownUser)
        userToken = createToken({ email: knownUser.email }, SECRET_KEY)
        nutritionId = await createEntry(entry, userId)
    })

    afterEach(async () => {
        await db.query('DELETE FROM nutrition')
        await db.query('DELETE FROM users')
    })

    afterAll(async () => {
        await db.end()
    })

    it('provides a JSON response containing arrays of summary stats for resources', async function () {
        const response = await request(app)
            .get('/activity')
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty('stats')
        expect(response.body.stats).toHaveProperty('nutrition')
        expect(response.body.stats.nutrition).toHaveProperty('calories')
        expect(response.body.stats.nutrition.calories).toHaveProperty('perDay')
        expect(response.body.stats.nutrition.calories).toHaveProperty(
            'perCategory'
        )
    })

    it("correctly calculates totalCaloriesPerDay for a user's nutrition entries", async function () {
        const response = await request(app)
            .get('/activity')
            .set('authorization', `Bearer ${userToken}`)

        expect(response.body.stats.nutrition.calories.perDay).toEqual([
            { date: '2023-12-23', totalCaloriesPerDay: 100 }
        ])
    })

    it("correctly calculates avgCaloriesPerCategory for a user's nutrition entries", async function () {
        const response = await request(app)
            .get('/activity')
            .set('authorization', `Bearer ${userToken}`)

        expect(response.body.stats.nutrition.calories.perCategory).toEqual([
            { category: 'Fruit', avgcaloriespercategory: '100.0' }
        ])
    })

    it('only returns summary stats based on entries that the currently authenticated user owns', async function () {
        await createUser(otherUser)
        const otherUserToken = createToken(
            { email: otherUser.email },
            SECRET_KEY
        )

        const responseUser1 = await request(app)
            .get('/activity')
            .set('authorization', `Bearer ${userToken}`)
        const responseUser2 = await request(app)
            .get('/activity')
            .set('authorization', `Bearer ${otherUserToken}`)

        expect(responseUser1.body.stats.nutrition.calories.perDay).not.toEqual(
            responseUser2.body.stats.nutrition.calories.perDay
        )
        expect(
            responseUser1.body.stats.nutrition.calories.perCategory
        ).not.toEqual(responseUser2.body.stats.nutrition.calories.perCategory)
    })

    it('throws an UnauthenticatedError if no valid user is logged in', async function () {
        const response = await request(app).get('/activity')

        expect(response.statusCode).toEqual(401)
    })
})
