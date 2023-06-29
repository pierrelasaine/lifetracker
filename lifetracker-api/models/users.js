/**
 * @fileoverview User model for managing user related data and actions. 
 * Includes login, registration and email based user fetch operations.
 *
 * @module User
 * @requires bcrypt
 * @requires database
 * @requires config
 * @requires errors
 */
const bcrypt = require('bcrypt')
const database = require('../database')
const { BCRYPT_WORK_FACTOR } = require('../config')
const { UnauthorizedError, BadRequestError } = require('../utils/errors')

const credentialsSchema = {
    id: String,
    username: String,
    hashedPassword: String,
    firstName: String,
    lastName: String,
    email: String
}

class User {
    /**
     * Attempts to log a user in with provided email and password.
     * @param {Object} credentials - The user's login credentials.
     * @param {string} credentials.email - The user's email.
     * @param {string} credentials.password - The user's password.
     * @returns {Object} The logged in user's data, excluding password.
     * @throws {UnauthorizedError} If the email doesn't exist or password doesn't match.
     */
    static async login({ email, password }) {
        if (!email || !password) throw new UnauthorizedError('Field missing')

        const result = await database.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )
        const user = result.rows[0]
        if (!user) throw new UnauthorizedError('Invalid email/password')

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) throw new UnauthorizedError('Invalid email/password')
    
        const { hashedPassword, ...userWithoutPassword } = user
    
        return userWithoutPassword
    }

    /**
     * Registers a new user with provided credentials.
     * @param {Object} credentials - The new user's credentials.
     * @param {string} credentials.username - The new user's desired username.
     * @param {string} credentials.password - The new user's desired password.
     * @param {string} credentials.firstName - The new user's first name.
     * @param {string} credentials.lastName - The new user's last name.
     * @param {string} credentials.email - The new user's email.
     * @returns {Object} The newly registered user's data.
     * @throws {BadRequestError} If email is invalid, username or email is already in use.
     */
    static async register( credentials ) {
        const { email, username, firstName, lastName, password  } = credentials
        if(!email || !username || !firstName || !lastName || !password)
            throw new BadRequestError('Missing required fields')

        const validateEmail = (email) => {
            const regularExpression = /\S+@\S+\.\S+/
            return regularExpression.test(email)
        }
        if (!validateEmail(email)) throw new BadRequestError(`Invalid email: ${email}`)

        const existingEmail = await database.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )
        if (existingEmail.rows[0])
            throw new BadRequestError(`An account already exists with email: ${email}`)

        const existingUsername = await database.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        )
        if (existingUsername.rows[0])
            throw new BadRequestError(`An account already exists with username: ${username}`)

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
        const result = await database.query(
            `INSERT INTO users (username, password, first_name, last_name, email)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, username, first_name, last_name, email`,
            [username, hashedPassword, firstName, lastName, email]
        )
        const user = result.rows[0]

        return user
    }

    /**
     * Fetches a user by their email.
     * @param {string} email - The email of the user to be fetched.
     * @returns {Object} The user's data.
     * @throws {BadRequestError} If no account exists with provided email.
     */
    static async fetchUserByEmail(email) {
        const result = await database.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )
        const user = result.rows[0]
        if (!user) throw new BadRequestError(`No account exists with email: ${email}`)

        return user
    }
}

module.exports = User
