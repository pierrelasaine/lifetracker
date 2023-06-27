/**
 * @fileoverview This module contains tests for the Express application.
 * It includes a suite of tests that verify the application's response to
 * different requests, as well as the presence of necessary middleware. 
 * The module uses Jest and supertest to execute the tests, and it should 
 * be run as part of the overall application test suite.
 * 
 * @module app.test
 * @requires supertest
 * @requires app - The Express application being tested.
 * @requires db - The application's database module.
 */
const request = require('supertest')
const app = require('./app')
const db = require('./db')

describe('Express application', () => {
    afterAll(async () => {
        await db.end()
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
