const express = require('express')
const User = require('../models/users')
const { SECRET_KEY } = require('../config')
const { createToken } = require('../utils/tokens')
const { requireAuthenticatedUser } = require('../middleware/security')

const authRouter = express.Router()

authRouter.post('/login', async (request, response) => {
    try {
        const { email, password } = request.body
        const user = await User.login({ email, password })
        const token = createToken({ email: user.email }, SECRET_KEY)

        response.status(200).json({ token: token, user: user })
    } catch (error) {
        response.status(error.status).json({ error: error.message })
    }
})

authRouter.post('/register', async (request, response) => {
    try {
        const credentials = request.body
        const user = await User.register(credentials)
        const token = createToken({ email: user.email }, SECRET_KEY)

        response.status(201).json({ token: token, user: user })
    } catch (error) {
        response.status(error.status).json({ error: error.message })
    }
})

authRouter.get('/me', requireAuthenticatedUser, async (request, response) => {
    try {
        const { email } = response.locals.user
        const user = await User.fetchUserByEmail(email)

        response.status(200).json({ user: user })
    } catch (error) {
        response.status(error.status).json({ error: error.message })
    }
})

module.exports = authRouter