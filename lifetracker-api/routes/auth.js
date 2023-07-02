/**
 * @fileoverview Express router for authentication operations like login, registration and fetching current user data.
 * @module routes/auth
 * @requires express - Express framework for handling HTTP requests and responses.
 * @requires ../models/users - The User model for database interaction.
 * @requires ../config - Configuration module containing the secret key for token creation.
 * @requires ../utils/tokens - Token utilities module for generating user tokens.
 * @requires ../middleware/security - Middleware for handling security-related operations such as authentication.
 */

const express = require('express')
const User = require('../models/users')
const { SECRET_KEY } = require('../config')
const { createToken } = require('../utils/tokens')
const requireAuth = require('../middleware/security').requireAuthenticatedUser

const authRouter = express.Router()

/**
 * Handles user login, creates a token for the authenticated user.
 * @name login
 * @route {POST} /login
 * @authentication This route requires no authentication.
 * @bodyparam {string} email, password - User credentials.
 */
authRouter.post('/login', async ({ body: { email, password } }, res) => {
    try {
        const user = await User.login({ email, password })
        const token = createToken({ email: user.email }, SECRET_KEY)
        res.status(200).json({ token, user })
    } catch ({ status, message }) {
        res.status(status).json({ error: message })
    }
})

/**
 * Registers a new user, creates a token for the registered user.
 * @name register
 * @route {POST} /register
 * @authentication This route requires no authentication.
 * @bodyparam {Object} credentials - User credentials.
 */
authRouter.post('/register', async ({ body: credentials }, res) => {
    try {
        const user = await User.register(credentials)
        const token = createToken({ email: user.email }, SECRET_KEY)
        res.status(201).json({ token, user })
    } catch ({ status, message }) {
        res.status(status).json({ error: message })
    }
})

/**
 * Fetches the authenticated user's data.
 * @name me
 * @route {GET} /me
 * @authentication This route requires authenticated users.
 */
authRouter.get('/me', requireAuth, async (req, res) => {
    try {
        const email = res.locals.user.email
        const user = await User.fetchUserByEmail(email)
        res.status(200).json({ user })
    } catch ({ status, message }) {
        res.status(status).json({ error: message })
    }
})

module.exports = authRouter
