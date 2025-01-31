/**
 * @fileoverview Test suite for the Nutrition model of an Express application.
 * @module models/nutrition.test
 * @requires ./nutrition - Nutrition model to be tested.
 * @requires ../db - Database module for test setup and teardown.
 * @requires ../utils/errors - Error classes to be used in tests.
 */

const Nutrition = require('./nutrition')
const db = require('../db')
const { BadRequestError, NotFoundError } = require('../utils/errors')
const { createUser, createEntry } = require('../utils/aux-utils')

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

describe('Nutrition', () => {
    let userId,
        nutritionId

    beforeEach(async () => {
        userId = await createUser(knownUser)
        nutritionId = await createEntry(entry, userId)
    })

    afterEach(async () => {
        await db.query('DELETE FROM nutrition')
        await db.query('DELETE FROM users')
    })

    afterAll(async () => await db.end())

    describe('createNutrition', () => {
        it('creates a valid nutrition entry', async () => {
            const nutrition = await Nutrition.createNutrition({
                name: 'Apple',
                category: 'Fruit',
                calories: 100,
                image_url: 'http://example.com',
                user_id: userId
            })

            expect(nutrition).toBeDefined()
            expect(nutrition.name).toEqual('Apple')
            expect(nutrition.user_id).toEqual(userId)
        })

        it('throws an error when any of the provided fields are invalid', async () => {
            await expect(
                Nutrition.createNutrition({
                    name: '',
                    category: 'Fruit',
                    calories: 100,
                    image_url: 'http://example.com',
                    user_id: userId
                })
            ).rejects.toThrow(BadRequestError)
        })

        it('creates a nutrition instance that is owned by the user', async () => {
            const nutrition = await Nutrition.createNutrition({
                name: 'Apple',
                category: 'Fruit',
                calories: 100,
                image_url: 'http://example.com',
                user_id: userId
            })
            const nutritionList = await Nutrition.listNutritionForUser(userId)

            const isOwnedByUser = nutritionList.some(
                entry => entry.id === nutrition.id
            )

            expect(isOwnedByUser).toEqual(true)
        })
    })

    describe('fetchNutritionById', () => {
        it('fetches nutrition by id', async () => {
            const nutrition = await Nutrition.fetchNutritionById(nutritionId)

            expect(nutrition).toBeDefined()
            expect(nutrition.id).toEqual(nutritionId)
        })

        it('throws an error if id is invalid', async () => {
            await expect(Nutrition.fetchNutritionById(999))
                .rejects.toThrow( NotFoundError)
        })
    })

    describe('listNutritionForUser', () => {
        it('lists nutrition for user', async () => {
            const nutritionList = await Nutrition.listNutritionForUser(userId)

            expect(nutritionList).toBeDefined()
            expect(nutritionList.length).toBeGreaterThan(0)
            expect(nutritionList[0].user_id).toEqual(userId)
        })

        it('returns empty array if no nutrition found', async () => {
            const nutritionList = await Nutrition.listNutritionForUser(999)

            expect(nutritionList).toBeDefined()
            expect(nutritionList.length).toEqual(0)
        })

        it('does not include any nutrition from other users', async () => {
            otherUserId = await createUser(otherUser)
            await createEntry(entry, otherUserId)
            const nutritionList = await Nutrition.listNutritionForUser(userId)

            const otherUserNutrition = nutritionList.filter(
                nutrition => nutrition.user_id !== userId
            )
            
            expect(otherUserNutrition.length).toEqual(0)
        })
    })
})
