/**
 * @fileoverview This module provides custom ExpressError classes for handling 
 * HTTP errors in Express apps.
 * 
 * Each class corresponds to a different HTTP status code and can be used to 
 * throw a specific error.
 *
 * Classes:
 * - `ExpressError`: Base class for HTTP errors, takes a message and a status 
 *   as input.
 * - `BadRequestError`: Represents a 400 Bad Request HTTP error, defaults to 
 *   the message "Bad Request".
 * - `UnauthorizedError`: Represents a 401 Unauthorized HTTP error, defaults 
 *   to the message "Unauthorized".
 * - `ForbiddenError`: Represents a 403 Forbidden HTTP error, defaults to the 
 *   message "Forbidden".
 * - `NotFoundError`: Represents a 404 Not Found HTTP error, defaults to the 
 *   message "Not Found".
 * 
 * @module errors
 * @exports ExpressError
 * @exports BadRequestError
 * @exports UnauthorizedError
 * @exports ForbiddenError
 * @exports NotFoundError
 */
class ExpressError extends Error {
    constructor(message, status) {
        super()
        this.message = message
        this.status = status
//        console.error(this.stack)
    }
}

class BadRequestError extends ExpressError {
    constructor(message = "Bad Request") {
        super(message, 400)
    }
}

class UnauthorizedError extends ExpressError {
    constructor(message = "Unauthorized") {
        super(message, 401)
    }
}

class ForbiddenError extends ExpressError {
    constructor(message = "Forbidden") {
        super(message, 403)
    }
}

class NotFoundError extends ExpressError {
    constructor(message = "Not Found") {
        super(message, 404)
    }
}

module.exports = {
    ExpressError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError
}
