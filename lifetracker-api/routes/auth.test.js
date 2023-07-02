/**
 * @fileoverview Test suite for authentication routes in an Express application.
 * @module routes/auth.test
 * @requires supertest - Library for HTTP assertions used to test Express routes.
 * @requires ../app - The main Express application to be tested.
 * @requires ../db - Database module for test data manipulation.
 * @requires ../utils/aux-utils - Auxiliary utilities for creating mock users and entries.
 * @requires ../utils/tokens - Token utilities module for generating user tokens.
 * @requires ../config - Configuration module containing the secret key for token creation.
 */

const request = require('supertest')
const app = require('../app')
const db = require('../db')
const { createUser } = require('../utils/aux-utils')
const { createToken } = require('../utils/tokens')
const { SECRET_KEY } = require('../config')

const knownUser = {
    username: 'mockKnownUsername',
    hashedPassword: process.env.MOCK_HASHED_PASSWORD,
    firstName: 'mockFirstName',
    lastName: 'mockLastName',
    email: 'valid@known.mock'
}

const otherUser = {
    username: 'mockOtherUsername',
    hashedPassword: process.env.MOCK_HASHED_PASSWORD,
    firstName: 'mockFirstName',
    lastName: 'mockLastName',
    email: 'valid@other.mock'
}

let newUser = {
    username: 'mockNewUsername',
    password: 'newPassword',
    firstName: 'mockFirstName',
    lastName: 'mockLastName',
    email: 'valid@new.mock'
}

describe('Auth Routes Test Suite', () => {
    beforeEach(async () => {
        await createUser(knownUser)
        newUser = {
            username: 'mockNewUsername',
            password: 'newPassword',
            firstName: 'mockFirstName',
            lastName: 'mockLastName',
            email: 'valid@new.mock'
        }
    })

    afterEach(async () => {
        await db.query('DELETE FROM users')
    })

    afterAll(async () => {
        await db.end()
    })

    describe('POST /auth/login', () => {
        it('should allow users to log in with valid credentials', async () => {
            const res = await request(app).post('/auth/login').send({
                email: knownUser.email,
                password: process.env.MOCK_PASSWORD
            })

            expect(res.status).toEqual(200)
            expect(res.body.token).toBeDefined()
        })

        it('should throw an UnauthorizedError if the user does not exist', async () => {
            const res = await request(app).post('/auth/login').send({
                email: 'nonExistentEmail@unknown.mock',
                password: process.env.MOCK_PASSWORD
            })

            expect(res.status).toEqual(401)
            expect(res.body.error).toEqual('Invalid credentials')
        })

        it('should throw an UnauthorizedError if the password is incorrect', async () => {
            const res = await request(app).post('/auth/login').send({
                email: knownUser.email,
                password: 'incorrectPassword'
            })

            expect(res.status).toEqual(401)
            expect(res.body.error).toEqual('Invalid credentials')
        })

        it('should throw an UnauthorizedError if the email is missing', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ password: process.env.MOCK_PASSWORD })

            expect(res.status).toEqual(401)
            expect(res.body.error).toEqual('Missing credentials')
        })

        it('should throw an UnauthorizedError if the password is missing', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: knownUser.email })

            expect(res.status).toEqual(401)
            expect(res.body.error).toEqual('Missing credentials')
        })
    })
    describe('POST /auth/register', () => {
        it('allows users to register with valid credentials', async () => {
            const res = await request(app).post('/auth/register').send(newUser)

            expect(res.status).toEqual(201)
        })

        it('returns a JWT token upon successful registration', async () => {
            const res = await request(app).post('/auth/register').send(newUser)

            expect(res.body.token).toBeDefined()
        })

        it('throws a BadRequestError when a required field is missing', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(knownUser)

            expect(res.status).toEqual(400)
            expect(res.body.error).toEqual('Missing required fields')
        })

        it('throws a BadRequestError when the provided email already exists', async () => {
            newUser.email = knownUser.email
            const res = await request(app).post('/auth/register').send(newUser)

            expect(res.status).toEqual(400)
            expect(res.body.error).toEqual(
                `Duplicate email: ${knownUser.email}`
            )
        })

        it('throws a BadRequestError when the provided username already exists', async () => {
            newUser.username = knownUser.username
            const res = await request(app).post('/auth/register').send(newUser)

            expect(res.status).toEqual(400)
            expect(res.body.error).toEqual(
                `Duplicate username: ${knownUser.username}`
            )
        })

        it('throws a BadRequestError when the provided email is invalid', async () => {
            newUser.email = 'invalidEmail'
            const res = await request(app).post('/auth/register').send(newUser)

            expect(res.status).toEqual(400)
            expect(res.body.error).toEqual(`Invalid email: ${newUser.email}`)
        })
    })

    describe('GET /auth/me', () => {
        it('returns the user when the user is logged in', async () => {
            const userToken = createToken(
                { email: knownUser.email },
                SECRET_KEY
            )
            const res = await request(app)
                .get('/auth/me')
                .set('Authorization', `Bearer ${userToken}`)

            expect(res.status).toEqual(200)
            expect(res.body.user).toBeDefined()
        })

        it('throws an UnauthorizedError when the user is not logged in', async () => {
            const res = await request(app).get('/auth/me')

            expect(res.status).toEqual(401)
            expect(res.body.error).toEqual('Not logged in')
        })
    })
})
