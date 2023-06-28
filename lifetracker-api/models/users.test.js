/**
 * @fileoverview The test suite for the User model. Contains test cases for the 
 * functions 'login', 'register', and 'fetchUserByEmail'. It validates the error 
 * handling of the functions and checks the correctness of their returned results. 
 * Prior to each test, a user is created and added to the database. After each 
 * test, the user is removed from the database to ensure a clean environment for 
 * the next test. The database connection is ended after all tests have run.
 *
 * @module models/users.test
 * @requires module:dotenv/config
 * @requires module:models/users
 * @requires module:database
 * @requires module:utils/errors
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
                .toThrow(UnauthorizedError);
        })

        it('should throw UnauthorizedError if password is invalid', async () => {
            await expect(User.login({ 
                email: 'valid@known.mock', 
                password: 'mockInvalid' 
            }))
                .rejects
                .toThrow(UnauthorizedError);
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