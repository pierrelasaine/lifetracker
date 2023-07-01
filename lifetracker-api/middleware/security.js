/**
 * @fileoverview Module handling the middleware for authentication in an Express application.
 * @module middleware/security
 * @requires module:../config - Contains the application secret key for token validation.
 * @requires module:../utils/tokens - Handles token validation.
 * @requires module:../utils/errors - Defines custom error types for the application.
 */

const { SECRET_KEY } = require('../config')
const { validateToken } = require('../utils/tokens')
const { UnauthorizedError } = require('../utils/errors')

/**
 * @function parseAuthorizationHeader
 * @description Middleware extracting the token from the authorization header, validating it, and storing the user in the response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to the next middleware function.
 * @returns {Function} next - Calls the next middleware function.
 */
const parseAuthorizationHeader = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader ? authHeader.split(' ')[1] : null
    res.locals.user = token ? validateToken(token, SECRET_KEY) : undefined
    return next()
}

/**
 * @function requireAuthenticatedUser
 * @description Middleware to validate the presence of authenticated user. Throws UnauthorizedError if no valid user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to the next middleware function.
 * @returns {Function} next - Calls the next middleware function.
 * @throws {module:../utils/errors.UnauthorizedError} - If no valid user is present.
 */
const requireAuthenticatedUser = (req, res, next) => {
    if (!res.locals.user)
        return next(new UnauthorizedError('Not logged in'))

    return next()
}

module.exports = {
    parseAuthorizationHeader,
    requireAuthenticatedUser
}
