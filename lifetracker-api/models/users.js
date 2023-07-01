/**
 * @fileoverview A User model for managing user data and authentication in a Node.js application.
 * @module models/users
 * @requires bcrypt - Library for hashing passwords.
 * @requires ../database - Database access module.
 * @requires ../config - Config module containing the bcrypt work factor.
 * @requires ../utils/errors - Error classes for exception handling.
 */

const bcrypt = require('bcrypt')
const database = require('../database')
const { BCRYPT_WORK_FACTOR } = require('../config')
const { UnauthorizedError, BadRequestError } = require('../utils/errors')

class User {
    /**
     * @description Attempt to log a user in with provided email and password.
     * @param {Object} credentials - The user's login credentials.
     * @param {string} credentials.email - The user's email.
     * @param {string} credentials.password - The user's password.
     * @returns {Promise<Object>} The logged in user's data, excluding password.
     * @throws {UnauthorizedError} If the email doesn't exist or password doesn't match.
     */
    static async login({ email, password }) {
        if (!email || !password)
            throw new UnauthorizedError('Missing credentials')

        const {
            rows: [user]
        } = await database.query('SELECT * FROM users WHERE email = $1', [
            email
        ])

        if (!user || !(await bcrypt.compare(password, user.password)))
            throw new UnauthorizedError('Invalid credentials')

        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    }

    /**
     * @description Register a new user with provided credentials.
     * @param {Object} credentials - The new user's credentials.
     * @param {string} credentials.username - The new user's desired username.
     * @param {string} credentials.password - The new user's desired password.
     * @param {string} credentials.firstName - The new user's first name.
     * @param {string} credentials.lastName - The new user's last name.
     * @param {string} credentials.email - The new user's email.
     * @returns {Promise<Object>} The newly registered user's data.
     * @throws {BadRequestError} If email is invalid or username/email is already in use.
     */
    static async register({ email, username, firstName, lastName, password }) {
        if (!email || !username || !firstName || !lastName || !password)
            throw new BadRequestError('Missing required fields')

        if (!/\S+@\S+\.\S+/.test(email))
            throw new BadRequestError(`Invalid email: ${email}`)

        const {
            rows: [existingUser]
        } = await database.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        )

        if (existingUser)
            throw new BadRequestError(
                `Duplicate ${
                    existingUser.email === email ? 'email' : 'username'
                }: ${existingUser.email === email ? email : username}`
            )

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
        const {
            rows: [user]
        } = await database.query(
            'INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, first_name, last_name, email',
            [username, hashedPassword, firstName, lastName, email]
        )

        return user
    }

    /**
     * @description Fetch a user by their email.
     * @param {string} email - The email of the user to fetch.
     * @returns {Promise<Object>} The user's data.
     * @throws {BadRequestError} If no account exists with provided email.
     */
    static async fetchUserByEmail(email) {
        const {
            rows: [user]
        } = await database.query('SELECT * FROM users WHERE email = $1', [
            email
        ])
        if (!user)
            throw new BadRequestError(`No account exists with email: ${email}`)

        return user
    }
}

module.exports = User
