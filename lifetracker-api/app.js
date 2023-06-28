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
const { parseAuthHeader, requireAuthenticatedUser } = require('./middleware/security')

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
/**
 * @supportqueue
 * is this right??
 * how do I pass in the request, response, next?
 * README.md line 533
 */
app.use(parseAuthHeader(request, response, next))
app.use(requireAuthenticatedUser(request, response, next))

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
/**
 * alternative??:
 * 
 * // Other middleware...
 *   // 404 middleware
 *  app.use((req, res, next) => {
 *  if (req.url === '/not-found') {
 *      res.status(404).send('Not found')
 *  } else {
 *      next()
 *  }
 *  })
 *
 *  // Generic error handler middleware
 *  app.use((err, req, res, next) => {
 *  // Log the error
 *  console.error(err)
 *
 *  // Send a 500 error response
 *  res.status(500).send('Something went wrong')
 *  })
 * 
 */

console.log(1, app.get('cors'))

module.exports = app