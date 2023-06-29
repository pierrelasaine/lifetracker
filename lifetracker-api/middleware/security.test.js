/**
 * @fileoverview Test file for security middleware functions. This test suite aims to ensure that 
 * the 'parseAuthorizationHeader' and 'requireAuthenticatedUser' functions are working as expected.
 *
 * @module middleware/security.test
 * @requires jwt JSON Web Token library.
 * @requires security The security middleware module.
 * @requires utils/errors The error utility module.
 * @requires config The configuration module.
 *
 * @description
 * A collection of tests for the 'security' module.
 * It includes tests for the following functions:
 * 1. @testsuite 'parseAuthorizationHeader': 
 *      - Ensures it extracts the user from a valid JWT.
 *      - Ensures it does not store a user when no valid JWT exists.
 *      - Ensures it does not store a user when an invalid JWT exists.
 * 2. @testsuite 'requireAuthenticatedUser': 
 *      - Throws an 'UnauthorizedError' when no valid user is present.
 *      - Does not throw an error when a valid user is present.
 */
const { parseAuthorizationHeader, requireAuthenticatedUser } = require('./security')
const { UnauthorizedError } = require('../utils/errors')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')

const mockPayload = { username: 'testuser', password: 'testpass' }
const mockToken = jwt.sign(mockPayload, SECRET_KEY)

describe('parseAuthorizationHeader() middleware', () => {
    it('should extract the user from a valid JWT', () => {
        const mockRequest = { headers: { authorization: `Bearer ${mockToken}` } }
        const mockResponse = { locals: {} }

        parseAuthorizationHeader(mockRequest, mockResponse, () => {})

        expect(mockResponse.locals.user).toMatchObject(mockPayload)
    })

    it('should not store a user when no valid JWT exists', () => {
        const mockRequest = { headers: {} }
        const mockResponse = { locals: {} }

        parseAuthorizationHeader(mockRequest, mockResponse, () => {})

        expect(mockResponse.locals.user).toBeUndefined()
    })

    it('should not store a user when an in valid JWT exists', () => {
        const mockRequest = { headers: { authorization: `Bearer invalid` } }
        const mockResponse = { locals: {} }

        parseAuthorizationHeader(mockRequest, mockResponse, () => {})

        expect(mockResponse.locals.user).toBeUndefined()
    })
})

describe('requireAuthenticatedUser() middleware', () => {
    it('throws an `UnauthorizedError when no valid user is present', () => {
        const mockRequest = {}
        const mockResponse = { locals: {} }

        expect(() => {
            requireAuthenticatedUser(mockRequest, mockResponse, () => {})
        }).toThrow(UnauthorizedError)
    })

    it('does not throw an error when a valid user is present', () => {
        const mockRequest = {}
        const mockResponse = { locals: { user: mockPayload } }
        const next = jest.fn()

        requireAuthenticatedUser(mockRequest, mockResponse, next)

        expect(next).toHaveBeenCalled()
    })
})