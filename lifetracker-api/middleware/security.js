/**
 * @fileoverview This module contains middleware functions for parsing authentication headers 
 * and requiring authenticated users in a Node.js Express application.
 * 
 * @module middleware/security
 * @requires config The configuration module with secret key.
 * @requires tokens The token utility module for token validation.
 * @requires errors The errors module for throwing Unauthorized errors.
 * @exports parseAuthorizationHeader
 * @exports requireAuthenticatedUser
 */
const { SECRET_KEY } = require('../config')
const { validateToken } = require('../utils/tokens')
const { UnauthorizedError } = require('../utils/errors')

/**
 * Middleware function to parse the authorization header.
 * Extracts the token from the authorization header, validates the token and stores the user
 * in the response locals. If no token is present, it does not store a user.
 * @param {Object} request The Express request object.
 * @param {Object} response The Express response object.
 * @param {Function} next The next middleware function.
 * @returns {Function} The next middleware function.
 */
const parseAuthorizationHeader = (request, response, next) => {
    const token = request.headers.authorization?.split(' ')[1]
    if (token) {
        const email = validateToken(token, SECRET_KEY)
        response.locals.user = (email)? email : undefined
    } else {
        response.locals.user = undefined
    }
    return next()
}

/**
 * Middleware function to validate the presence of authenticated user.
 * Throws an UnauthorizedError if no valid user is present in the response locals.
 * @param {Object} request The Express request object.
 * @param {Object} response The Express response object.
 * @param {Function} next The next middleware function.
 * @returns {Function} The next middleware function.
 * @throws {UnauthorizedError} If no valid user is present in the response locals.
 */
const requireAuthenticatedUser = (request, response, next) => {
    try {
        if (!response.locals.user)
            throw new UnauthorizedError('Not logged in')
            
        return next()
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    parseAuthorizationHeader,
    requireAuthenticatedUser
}