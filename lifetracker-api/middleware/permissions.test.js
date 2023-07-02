/**
 * @fileoverview Test suite for the permissions middleware of an Express application.
 * @module middleware/permissions.test
 * @requires ./permissions - Permissions middleware functions to be tested.
 * @requires ../utils/errors - Error classes to be used in tests.
 * @requires ../models/nutrition - Nutrition data model for creating mock nutrition data.
 * @requires ../db - Database connection module for testing database-related functionality.
 */

const { ForbiddenError, NotFoundError } = require("../utils/errors")
const { authedUserOwnsNutrition } = require("./permissions")
const Nutrition = require("../models/nutrition")
const db = require("../db")

describe("permissions middleware", () => {
    afterAll(() => db.end())
    test("throws error if authenticated user doesn't own nutrition", async () => {
        const mockReq = {
            params: { id: 1 },
            user: { id: 2 }
        }
        const mockRes = {
            locals: {}
        }
        const mockNext = jest.fn()
        Nutrition.fetchNutritionById = jest.fn().mockReturnValue({ id: 1, user_id: 1 })

        await authedUserOwnsNutrition(mockReq, mockRes, mockNext)
        
        expect(mockNext).toHaveBeenCalledWith(new ForbiddenError())
    })

    test("throws NotFoundError if id of nutrition isn't found in database", async () => {
        const mockReq = {
            params: { id: 999 },
            user: { id: 1 }
        }
        const mockRes = {
            locals: {}
        }
        const mockNext = jest.fn()
        Nutrition.fetchNutritionById = jest.fn().mockReturnValue(null)

        await authedUserOwnsNutrition(mockReq, mockRes, mockNext)

        expect(mockNext).toHaveBeenCalledWith(new NotFoundError())
    })

    test("doesn't throw error if authenticated user is nutrition owner", async () => {
        const mockReq = {
            params: { id: 1 },
            user: { id: 1 }
        }
        const mockRes = {
            locals: {}
        }
        const mockNext = jest.fn()
        Nutrition.fetchNutritionById = jest.fn().mockReturnValue({ id: 1, user_id: 1 })

        await authedUserOwnsNutrition(mockReq, mockRes, mockNext)

        expect(mockNext).not.toHaveBeenCalledWith(expect.any(Error))
    })

    test("attaches the nutrition to the locals property of the response when the user owns the nutrition instance", async     () => {
        const mockReq = {
            params: { id: 1 },
            user: { id: 1 }
        }
        const mockRes = {
            locals: {}
        }
        const mockNext = jest.fn()
        Nutrition.fetchNutritionById = jest.fn().mockReturnValue({ id: 1, user_id: 1 })

        await authedUserOwnsNutrition(mockReq, mockRes, mockNext)

        expect(mockRes.locals.nutrition).toEqual({ id: 1, user_id: 1 })
    })
})
