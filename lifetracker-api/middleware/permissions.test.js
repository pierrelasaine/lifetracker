/**
 * @fileoverview Test suite for the permissions middleware of an Express application.
 * @module middleware/permissions.test
 * @requires ./permissions - Permissions middleware functions to be tested.
 * @requires ../utils/errors - Error classes to be used in tests.
 * @requires ../models/nutrition - Nutrition data model for creating mock nutrition data.
 * @requires ../db - Database connection module for testing database-related functionality.
 * @requires ../utils/aux-utils - Utility functions for creating mock data.
 */

const { ForbiddenError, NotFoundError } = require('../utils/errors')
const { createUser, createEntry } = require('../utils/aux-utils')
const { authedUserOwnsNutrition } = require('./permissions')
const Nutrition = require('../models/nutrition')
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

const entry = {
    name: 'Apple',
    category: 'Fruit',
    calories: 100,
    image_url: 'http://example.com'
}

describe('permissions middleware', () => {
    let userId
    let nutritionId
    beforeEach(async () => {
        userId = await createUser(knownUser)
        nutritionId = await createEntry(entry, userId)
    })

    afterEach(async () => {
        await db.query('DELETE FROM nutrition')
        await db.query('DELETE FROM users')
    })

    afterAll(() => db.end())

    it("throws error if authenticated user doesn't own nutrition", async () => {
        const otherUserId = await createUser(otherUser)
        nutritionId = await createEntry(entry, otherUserId)
        const req = { params: { nutritionId: nutritionId } }
        const res = { locals: { user: { email: knownUser.email } } }
        const next = jest.fn()

        await authedUserOwnsNutrition(req, res, next)

        expect(next).toHaveBeenCalledWith(new ForbiddenError())
    })

    it("throws NotFoundError if id of nutrition isn't found in database", async () => {
        const req = { params: { nutritionId: 999 } }
        const res = { locals: { user: { email: knownUser.email } } }
        const next = jest.fn()
        Nutrition.fetchNutritionById = jest.fn().mockReturnValue(null)

        await authedUserOwnsNutrition(req, res, next)

        expect(next).toHaveBeenCalledWith(new NotFoundError())
    })

    it("doesn't throw error if authenticated user is nutrition owner", async () => {
        const req = { params: { nutritionId: nutritionId } }
        const res = { locals: { user: { email: knownUser.email } } }
        const next = jest.fn()
        Nutrition.fetchNutritionById = jest
            .fn()
            .mockReturnValue({ id: nutritionId, user_id: userId })

        await authedUserOwnsNutrition(req, res, next)

        expect(next).not.toHaveBeenCalledWith(expect.any(Error))
    })

    it('attaches the nutrition to the locals property of the response when the user owns the nutrition instance', async () => {
        const req = { params: { nutritionId: nutritionId } }
        const res = { locals: { user: { email: knownUser.email } } }
        const next = jest.fn()
        Nutrition.fetchNutritionById = jest
            .fn()
            .mockReturnValue({ id: nutritionId, user_id: userId })

        await authedUserOwnsNutrition(req, res, next)

        expect(res.locals.nutrition).toEqual({
            id: nutritionId,
            user_id: userId
        })
    })
})
