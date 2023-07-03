/**
 * @fileoverview Testing of /nutrition routes.
 * @module tests/nutritionRoutes
 * @requires supertest - HTTP assertions made easy via SuperTest.
 * @requires ../app - Main Express application.
 * @requires ../db - Database interaction module.
 * @requires ../models/nutrition - The Nutrition model for database interaction.
 * @requires ../utils/aux-utils - Auxiliary utilities for creating mock users and entries.
 * @requires ../utils/tokens - Token utilities module for generating user tokens.
 * @requires ../config - Configuration module containing the secret key for token creation.
 */

const request = require('supertest')
const app = require('../app')
const db = require('../db')
const Nutrition = require('../models/nutrition')
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

let userId,
    userToken,
    nutritionId

describe('Nutrition Routes Test', () => {
    beforeEach(async () => {
        userId = await createUser(knownUser)
        userToken = createToken({ email: knownUser.email }, SECRET_KEY)
        nutritionId = await createEntry(entry, userId)
    })

    afterEach(async () => {
        await db.query('DELETE FROM nutrition')
        await db.query('DELETE FROM users')
    })

    afterAll(async () => await db.end())

    describe('GET /nutrition', () => {
        it('returns an array of all nutrition entries belonging to the user', async () => {
            const response = await request(app)
                .get('/nutrition')
                .set('Authorization', `Bearer ${userToken}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.nutritions.length).toBe(1)
        })

        it("doesn't include other user's entries in the nutritions array", async () => {
            otherUserId = await createUser(otherUser)
            otherUserToken = await createToken(
                { email: otherUser.email },
                SECRET_KEY
            )

            const response = await request(app)
                .get('/nutrition')
                .set('Authorization', `Bearer ${otherUserToken}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.nutritions.length).toBe(0)
        })

        it('throws UnauthorizedError if no valid user is logged in', async () => {
            const response = await request(app).get('/nutrition')

            expect(response.statusCode).toBe(401)
        })
    })

    describe('POST /nutrition', () => {
        it('authenticated users can create a new nutrition entry when providing values for all the required fields', async () => {
            const response = await request(app)
                .post('/nutrition')
                .send({
                    nutrition: {
                        name: 'Apple',
                        category: 'Fruits',
                        calories: 95,
                        image_url: 'https://example.com/apple.png'
                    }
                })
                .set('Authorization', `Bearer ${userToken}`)

            expect(response.statusCode).toBe(201)
            expect(response.body.nutrition.name).toBe('Apple')
        })

        it('the new nutrition entry belongs to the user that created it', async () => {
            const response = await request(app)
                .post('/nutrition')
                .send({
                    nutrition: {
                        name: 'Apple',
                        category: 'Fruits',
                        calories: 95,
                        image_url: 'https://example.com/apple.png'
                    }
                })
                .set('Authorization', `Bearer ${userToken}`)

            const nutrition = await Nutrition.fetchNutritionById(nutritionId)

            expect(nutrition.user_id).toBe(userId)
        })

        it('throws a BadRequestError if any of the required fields are missing', async () => {
            const response = await request(app)
                .post('/nutrition')
                .send({
                    nutrition: {
                        name: 'Apple',
                        category: 'Fruits',
                        image_url: 'https://example.com/apple.png'
                    }
                })
                .set('Authorization', `Bearer ${userToken}`)

            expect(response.statusCode).toBe(400)
        })

        it('throws an UnauthorizedError if no valid user is logged in', async () => {
            const response = await request(app).post('/nutrition')

            expect(response.statusCode).toBe(401)
        })
    })

    describe('GET /nutrition/:nutritionId', () => {
        it('nutrition owner can fetch a nutrition entry when providing a valid id', async () => {
            const response = await request(app)
                .get(`/nutrition/${nutritionId}`)
                .set('Authorization', `Bearer ${userToken}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.nutrition.name).toBe('Apple')
        })

        it('throws a 403 ForbiddenError if a user tries to access a nutrition instance that does not belong to them', async () => {
            otherUserId = await createUser(otherUser)
            otherUserToken = await createToken(
                { email: otherUser.email },
                SECRET_KEY
            )

            const response = await request(app)
                .get(`/nutrition/${nutritionId}`)
                .set('Authorization', `Bearer ${otherUserToken}`)

            expect(response.statusCode).toBe(403)
        })

        it('throws a 404 NotFoundError when the nutritionId does not match any nutrition in the database', async () => {
            const response = await request(app)
                .get(`/nutrition/999`)
                .set('Authorization', `Bearer ${userToken}`)

            expect(response.statusCode).toBe(404)
        })

        it('throws a 401 UnauthorizedError if no valid user is logged in', async () => {
            const response = await request(app).get(`/nutrition/${nutritionId}`)

            expect(response.statusCode).toBe(401)
        })
    })
})
