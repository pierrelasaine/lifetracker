/**
 * @fileoverview This module handles the configuration of environment variables for an Express.js application. 
 * It reads the application's environment variables, provides defaults if necessary, and exports these 
 * values for use in other parts of the application.
 *
 * The following environment variables are managed:
 * - `PORT`: The port number on which the Express.js server should listen.
 * - `SECRET_KEY`: The secret key for signing and verifying JWTs.
 * - `BCRYPT_WORK_FACTOR`: The work factor to be used by bcrypt for hashing passwords.
 * - `IS_TESTING`: A boolean flag that is true if the application is in the testing environment.
 * 
 * In addition to these environment variables, the module also exports a function, `getDatabaseUri`, 
 * which returns the appropriate database URI based on the current environment.
 *
 * @module config
 * @requires dotenv
 *
 * @exports PORT
 * @exports SECRET_KEY
 * @exports BCRYPT_WORK_FACTOR
 * @exports IS_TESTING
 * @exports getDatabaseUri
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