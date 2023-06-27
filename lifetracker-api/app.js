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
 * @module app
 * @requires express - Express.js for creating the application.
 * @requires morgan - For logging HTTP requests.
 * @requires cors - For enabling Cross-Origin Resource Sharing.
 */
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.get('/', (request, response) => {
    response.status(200).json({ "ping": "pong" })
})

console.log(1, app.get('cors'))

module.exports = app