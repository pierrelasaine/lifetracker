/**
 * @fileoverview Test file for Express application setup and its middlewares.
 * @module app.test
 * @requires supertest HTTP assertions module.
 * @requires app The Express application module.
 * @requires db The database connection module.
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
        expect(response.body).toEqual({ ping: 'pong' })
    })

    it('should include middleware: `cors`', async () => {
        const response = await request(app).get('/')

        expect(response.headers['access-control-allow-origin']).toBeDefined()
    })

    it('should include middleware: `express.json`', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ test: 'test' })
            .set('Accept', 'application/json')
            
        expect(response.body).toEqual({ error: "Missing credentials" })
    })
})
