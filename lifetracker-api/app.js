/**
 * @fileoverview This module creates an Express application and applies 
 * the necessary middleware for the application. It exports the configured 
 * Express application for use in other modules.
 * 
 * The middleware applied includes JSON parsing for incoming request bodies, 
 * logging with `morgan` in development mode, and enabling Cross-Origin 
 * Resource Sharing (CORS) with the `cors` middleware.
 * 
 * There is also a test route configured on the root URL ("/") that returns 
 * a JSON object `{ "ping": "pong" }` when a `GET` request is made to it. 
 * 
 * --- add more here ---
 * Additionally, there is a 404 handler that is applied as the last middleware.
 * ---------------------
 * 
 * @module app
 * @requires express - Express.js for creating the application.
 * @requires morgan - For logging HTTP requests.
 * @requires cors - For enabling Cross-Origin Resource Sharing.
 */
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { NotFoundError } = require('./utils/errors')
const { parseAuthorizationHeader, requireAuthenticatedUser } = require('./middleware/security')
const authRoutes = require('./routes/auth')
const nutritionRoutes = require('./routes/nutrition')
const activityRouter = require('./routes/activity')

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(parseAuthorizationHeader)
app.use('/auth', authRoutes)
app.use('/nutrition', nutritionRoutes)
app.use('/activity', activityRouter)

app.use((error, request, response, next) => {
    console.error(error)
    const status = error.status || 500
    response.status(status).json({ error: error.message || 'Something went wrong!' })
})

app.get('/', (request, response) => {
    response.status(200).json({ "ping": "pong" })
})


/**
 * @supportqueue
 * is this right??
 * README.md line 446
 */
app.get('*', (request, response, next) => {
    next(new NotFoundError)
})
 

module.exports = app