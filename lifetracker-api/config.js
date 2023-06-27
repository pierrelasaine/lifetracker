/**
 * @fileoverview This module is responsible for configuring and exporting 
 * environment variables and application settings.
 *
 * It uses the dotenv library to load environment variables from a .env file 
 * into process.env, if such a file exists. It then extracts, formats, and 
 * exports these variables for use throughout the application. These variables
 * include PORT, SECRET_KEY, BCRYPT_WORK_FACTOR, IS_TESTING, and the function 
 * getDatebaseUri.
 *
 * PORT: The port on which the server runs, default is 3001.
 * SECRET_KEY: A secret key for encoding and decoding JWTs.
 * BCRYPT_WORK_FACTOR: Work factor for bcrypt hashing algorithm, default is 12.
 * IS_TESTING: A boolean indicating whether the environment is for testing.
 *
 * The getDatebaseUri function constructs and returns the database connection 
 * URI, which depends on whether the environment is for testing, whether the 
 * DATABASE_URL environment variable exists, and the values of the 
 * DATABASE_HOST, DATABASE_PORT, and DATABASE_NAME variables.
 */
require('dotenv').config()

const PORT = Number(process.env.PORT || 3001)
const SECRET_KEY = process.env.SECRET_KEY || 'secret'
const BCRYPT_WORK_FACTOR = Number(process.env.BCRYPT_WORK_FACTOR || 12)
const IS_TESTING = process.env.NODE_ENV === 'test'

/**
 * Returns the appropriate database URI depending on the current application 
 * state:
 *    - If the NODE_ENV environment variable is set to 'test', the test
 *      database URI is returned
 *    - If the DATABASE_URL environment variable is set, that URI is returned
 *    - Otherwise, a connection string is constructed from the database
 *      environment variables
 *
 * @returns {string} - The database URI string.
 */
const getDatebaseUri = () => {
    const IS_TESTING = process.env.NODE_ENV === 'test'
    const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost'
    const DATABASE_PORT = process.env.DATABASE_PORT || 5432
    const DATABASE_NAME = process.env.DATABASE_NAME || 'lifetracker'

    return (IS_TESTING)
        ? 'postgresql://postgres:postgres@localhost/testingURL'
        : process.env.DATABASE_URL || `postgresql://postgres:postgres@
                                       ${DATABASE_HOST}:
                                       ${DATABASE_PORT}/
                                       ${DATABASE_NAME}`
}

module.exports = {
    PORT,
    SECRET_KEY,
    BCRYPT_WORK_FACTOR,
    IS_TESTING,
    getDatebaseUri
}