/**
 * @fileoverview Test file for token utility functions. This test suite aims to ensure that 
 * the 'createToken' and 'validateToken' functions are working as expected.
 *
 * @module utils/tokens.test
 * @requires jwt JSON Web Token library.
 * @requires tokens The token utility module.
 * @requires config The configuration module.
 *
 * @description
 * A collection of tests for the 'tokens' module.
 * It includes tests for the following functions:
 * 1. @testsuite 'createToken': 
 *      - Ensures it creates a valid JWT for user payload.
 * 2. @testsuite 'validateToken': 
 *      - Ensures it extracts the payload from a valid JWT.
 *      - Ensures it returns null for an invalid token.
 *      - Ensures it returns null when the token is parsed with an incorrect secret.
 */
const jwt = require('jsonwebtoken')
const { createToken, validateToken } = require('./tokens')
const { SECRET_KEY } = require('../config')

const secret = SECRET_KEY
const mockPayload = {
    id: "mock",
    username: "mock_user"
}

describe('Token utilities', () => {
    let mockToken
    beforeEach(() => {
        mockToken = jwt.sign(mockPayload, secret)
    })

    describe('createToken', () => {
        it('creates valid JWT for user payload', () => {
            const decoded = jwt.verify(mockToken, secret)

            expect(decoded.id).toBe(mockPayload.id)
            expect(decoded.username).toBe(mockPayload.username)
        })
    })

    describe('validateToken', () => {
        it('extracts payload from valid JWT', () => {
            const result = validateToken(mockToken, secret)

            expect(result.id).toBe(mockPayload.id)
            expect(result.username).toBe(mockPayload.username)
        })

        it('returns null for invalid token', () => {
            const invalidToken = 'this.is.clearly.invalid'

            const result = validateToken(invalidToken, secret)

            expect(result).toBeNull()
        })

        it('returns null when token is parsed with incorrect secret', () => {
            const wrongSecret = 'wrong_secret'

            const result = validateToken(mockToken, wrongSecret)

            expect(result).toBeNull()
        })
    })
})
