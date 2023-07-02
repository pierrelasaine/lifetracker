/**
 * @fileoverview Test suite for the 'User' model of a user management system.
 * @module models/users.test
 * @requires dotenv - Module to load environment variables for the test setup.
 * @requires ./users - The User model module to be tested.
 * @requires ../db - Database module to set up and tear down test data.
 * @requires ../utils/errors - Error classes to be used in tests.
 */

require('dotenv').config()
const User = require('./users')
const db = require('../db')
const { UnauthorizedError, BadRequestError } = require('../utils/errors')

const knownUser = {
    username: 'mockKnownUsername',
    hashedPassword: process.env.MOCK_HASHED_PASSWORD,
    firstName: 'mockFirstName',
    lastName: 'mockLastName',
    email: 'valid@known.mock'
}

describe('User', () => {
    beforeEach(async () => {
        await db.query(
            `
            INSERT INTO users (username, password, first_name, last_name, email)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                knownUser.username,
                knownUser.hashedPassword,
                knownUser.firstName,
                knownUser.lastName,
                knownUser.email
            ]
        )
    })

    afterEach(async () => await db.query('DELETE FROM users'))

    afterAll(async () => await db.end())

    describe('login', () => {
        it('logs in with correct credentials', async () => {
            const result = await User.login({
                email: knownUser.email,
                password: 'mockPassword'
            })

            expect(result).toBeDefined()
            expect(result.email).toBe(knownUser.email)
        })

        it('throws UnauthorizedError with unknown email', async () => {
            await expect(
                User.login({
                    email: 'unknown@unknown.mock',
                    password: 'mockPassword'
                })
            ).rejects.toThrow(UnauthorizedError)
        })

        it('throws UnauthorizedError with incorrect password', async () => {
            await expect(
                User.login({
                    email: knownUser.email,
                    password: 'mockWrongPassword'
                })
            ).rejects.toThrow(UnauthorizedError)
        })
    })

    describe('register', () => {
        const newUser = {
            username: 'mockNewUsername',
            password: 'mockPassword',
            firstName: 'mockFirstName',
            lastName: 'mockLastName',
            email: 'valid@new.mock'
        }

        it('registers with valid credentials', async () => {
            const result = await User.register(newUser)

            expect(result).toBeDefined()
            expect(result.email).toBe(newUser.email)
        })

        it('throws BadRequestError with duplicate email', async () => {
            await expect(
                User.register({ ...newUser, email: knownUser.email })
            ).rejects.toThrow(BadRequestError)
        })

        it('throws BadRequestError with duplicate username', async () => {
            await expect(
                User.register({ ...newUser, username: knownUser.username })
            ).rejects.toThrow(BadRequestError)
        })

        it('throws BadRequestError with invalid email', async () => {
            await expect(
                User.register({ ...newUser, email: 'invalidUnknown.mock' })
            ).rejects.toThrow(BadRequestError)
        })
    })

    describe('fetchUserByEmail', () => {
        it('returns user with valid email', async () => {
            const user = await User.fetchUserByEmail(knownUser.email)
            
            expect(user).toBeDefined()
            expect(user.email).toBe(knownUser.email)
        })

        it('throws BadRequestError with invalid email', async () => {
            await expect(
                User.fetchUserByEmail('invalid@unknown.mock')
            ).rejects.toThrow(BadRequestError)
        })
    })
})
