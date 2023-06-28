/**
 * @fileoverview Test file for User model functions. The test suite ensures that the 
 * 'login', 'register', and 'fetchUserByEmail' methods are working as expected.
 *
 * @module models/users.test
 * @requires dotenv Configuration module that loads environment variables.
 * @requires users The User model module.
 * @requires database The database connection module.
 * @requires utils/errors Custom error classes module.
 *
 * @description
 * A collection of tests for the 'User' model.
 * The test suite includes:
 * 1. @testsuite 'login': 
 *      - Ensures it logs in successfully with proper credentials.
 *      - Ensures it throws UnauthorizedError if email is unknown.
 *      - Ensures it throws UnauthorizedError if password is invalid.
 * 2. @testsuite 'register': 
 *      - Ensures it registers successfully with proper credentials.
 *      - Ensures it throws BadRequestError if email is duplicate.
 *      - Ensures it throws BadRequestError if username is duplicate.
 *      - Ensures it throws BadRequestError if email is invalid.
 * 3. @testsuite 'fetchUserByEmail': 
 *      - Ensures it returns a user from the database with a valid email.
 *      - Ensures it handles invalid emails correctly by throwing a BadRequestError.
 */
require('dotenv').config()
const User = require('./users')
const database = require('../database')
const { UnauthorizedError, BadRequestError } = require('../utils/errors')

describe('User', () => {
    beforeEach(async () => {
        const username = 'mockKnownUsername'
        const hashedPassword = process.env.MOCK_HASHED_PASSWORD
        const firstName = 'mockFirstName'
        const lastName = 'mockLastName'
        const email = 'valid@known.mock'

        await database.query(
            `INSERT INTO users (username, password, first_name, last_name, email)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, username, first_name, last_name, email`,
            [username, hashedPassword, firstName, lastName, email]
        )
    })

    afterEach(async () => {
        await database.query('DELETE FROM users')
    })

    afterAll(async () => {
        await database.end()
    })

    describe('login', () => {
        it('should login successfully with proper credentials', async () => {
            const result = await User.login({ 
                email: 'valid@known.mock', 
                password: 'mockPassword' 
            })

            expect(result).toBeDefined()
            expect(result.email).toEqual('valid@known.mock')
        })

        it('should throw UnauthorizedError if email is unknown', async () => {
            await expect(User.login({
                email: 'valid@unknown.mock', 
                password: 'mockPassword' 
            }))
                .rejects
                .toThrow(UnauthorizedError)
        })

        it('should throw UnauthorizedError if password is invalid', async () => {
            await expect(User.login({ 
                email: 'valid@known.mock', 
                password: 'mockInvalid' 
            }))
                .rejects
                .toThrow(UnauthorizedError)
        })
    })

    describe('register', () => {
        it('should register successfully with proper credentials', async () => {
            const result = await User.register({
                username: 'mockUnknownUsername',
                password: 'mockPassword',
                firstName: 'mockFirstName',
                lastName: 'mockLastName',
                email: 'valid@unknown.mock'
            })

            expect(result).toBeDefined()
            expect(result.email).toEqual('valid@unknown.mock')
        })

        it('should throw BadRequestError if email is duplicate', async () => {
            await expect(User.register({
                username: 'mockUnknownUsername',
                password: 'mockPassword',
                firstName: 'mockFirstName',
                lastName: 'mockLastName',
                email: 'valid@known.mock'
            }))
                .rejects
                .toThrow(BadRequestError)
        })

        it('should throw BadRequestError if username is duplicate', async () => {
            await expect(User.register({
                username: 'mockKnownUsername',
                password: 'mockPassword',
                firstName: 'mockFirstName',
                lastName: 'mockLastName',
                email: 'valid@unknown.mock'
            }))
                .rejects
                .toThrow(BadRequestError)   
        })

        it('should throw BadRequestError if email is invalid', async () => {
            await expect(User.register({
                username: 'mockUnknownUsername',
                password: 'mockPassword',
                firstName: 'mockFirstName',
                lastName: 'mockLastName',
                email: 'invalidUnknown.mock'
            }))
                .rejects
                .toThrow(BadRequestError) 
        })
    })

    describe('fetchUserByEmail', () => {
        it('should return a user from the database with a valid email', async () => {
            const user = await User.fetchUserByEmail('valid@known.mock')

            expect(user).toBeDefined()
            expect(user.email).toEqual('valid@known.mock')
        })

        it('should handle invalid emails correctly', async () => {
            await expect(User.fetchUserByEmail('invalid@unknown.mock'))
                .rejects
                .toThrow(BadRequestError)
        })
    })
})