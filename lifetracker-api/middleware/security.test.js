/**
 * @fileoverview Test suite for the security middleware of an Express application.
 * @module middleware/security.test
 * @requires jwt - JSON Web Token library to create mock tokens for testing.
 * @requires ./security - Security middleware functions to be tested.
 * @requires ../utils/errors - Error classes to be used in tests.
 * @requires ../config - Config module containing the secret key for token signing.
 */

const jwt = require('jsonwebtoken')
const { UnauthorizedError } = require('../utils/errors')
const { SECRET_KEY } = require('../config')
const {
    parseAuthorizationHeader,
    requireAuthenticatedUser
} = require('./security')

const mockPayload = { username: 'testuser', password: 'testpass' }
const mockToken = jwt.sign(mockPayload, SECRET_KEY)

describe('parseAuthorizationHeader', () => {
    it('extracts the user from a valid JWT', () => {
        const req = { headers: { authorization: `Bearer ${mockToken}` } }
        const res = { locals: {} }

        parseAuthorizationHeader(req, res, () => {})

        expect(res.locals.user).toMatchObject(mockPayload)
    })

    it('does not store a user when no valid JWT exists', () => {
        const req = { headers: {} }
        const res = { locals: {} }

        parseAuthorizationHeader(req, res, () => {})

        expect(res.locals.user).toBeUndefined()
    })

    it('does not store a user when an invalid JWT exists', () => {
        const req = { headers: { authorization: 'Bearer invalid' } }
        const res = { locals: {} }

        parseAuthorizationHeader(req, res, () => {})

        expect(res.locals.user).toBeNull()
    })
})

describe('requireAuthenticatedUser', () => {
    it('throws UnauthorizedError when no valid user is present', () => {
        const req = {}
        const res = { locals: {} }
        const next = jest.fn()

        requireAuthenticatedUser(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError))
    })

    it('does not throw an error when a valid user is present', () => {
        const req = {}
        const res = { locals: { user: mockPayload } }
        const next = jest.fn()

        requireAuthenticatedUser(req, res, next)
        
        expect(next).toHaveBeenCalled()
    })
})
