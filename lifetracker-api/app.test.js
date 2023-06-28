/**
 * @fileoverview Test file for Express application setup and its middlewares. 
 * The test suite ensures that the root route and included middlewares 
 * are working as expected.
 *
 * @module app.test
 * @requires supertest HTTP assertions module.
 * @requires app The Express application module.
 * @requires database The database connection module.
 *
 * @description
 * A collection of tests for the Express application setup.
 * The test suite includes:
 * 1. Testing the response to 'GET /' request.
 *      - Ensures it responds with a JSON object '{ "ping": "pong" }'.
 * 2. Testing for inclusion of middleware: `morgan`, `cors`, and `express.json`.
 *      - Ensures each middleware is defined in the app.
 * @todo There is an issue with `app.use` in the middleware tests that needs to be resolved.
 */
const request = require('supertest')
const app = require('./app')
const database = require('./database')

describe('Express application', () => {
    afterAll(async () => {
        await database.end()
    })

    it(`should respond to 'GET /' request with route with a JSON object of 
       '{ "ping": "pong" }'`, async () => {
        const response = await request(app).get('/')
        
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({ "ping": "pong" })
    })
    /**
     * @supportqueue 
     * there is something wrong with app.use in the tests below 
     */
    it('should include middleware: `morgan`', () => {
        const morgan = app.get('morgan')

        expect(morgan).toBeDefined()
    })

    it('should include middleware: `cors`', () => {
        const cors = app.get('cors')

        expect(cors).toBeDefined()
    })

    it('should include middleware: `express.json`', () => {
        const bodyParser = app.get('express.json')

        expect(bodyParser).toBeDefined()
    })
})
