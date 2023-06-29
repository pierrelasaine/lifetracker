/**
 * @fileoverview Module providing utility functions for working with JSON Web Tokens (JWTs).
 * It provides a 'createToken' function for creating JWTs from a provided payload, and a 
 * 'validateToken' function for validating a provided JWT and extracting its payload.
 *
 * @module utils/tokens
 * @requires jsonwebtoken The JSON Web Token library.
 * @requires config The configuration module, providing the secret key.
 * @exports createToken
 * @exports validateToken
 *
 * @description
 * A collection of utilities for JWTs:
 * 1. @function 'createToken': 
 *      - Creates a JWT from a provided payload and secret.
 * 2. @function 'validateToken': 
 *      - Validates a provided JWT using a secret, and extracts the payload if valid.
 *      - Returns null if the JWT is invalid or if the secret does not match.
 */
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')

/**
 * Generate a JSON Web Token (JWT) from the given payload.
 * @param {Object} payload - An object that contains the data to be encoded into the JWT.
 * @param {string} secret - The secret key used for signing the JWT.
 * @returns {string|null} The JWT if successful, or null if an error occurred.
 */
const createToken = (payload, secret) => {
    return jwt.sign(payload, secret) || null
}

/**
 * Validate the given JWT using the provided secret key and return its payload.
 * @param {string} token - The JWT to validate.
 * @param {string} secret - The secret key used to verify the JWT.
 * @returns {Object|null} The payload of the JWT if the token is valid, or null if the token is invalid or if the secret key does not match.
 */
const validateToken = (token, secret) => {
    if (secret !== SECRET_KEY) {
        return null
    } else {
        try {
            return jwt.verify(token, secret)
        } catch (error) {
            return null
        }
    }
}

module.exports = {
    createToken,
    validateToken
}