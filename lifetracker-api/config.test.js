/**
 * Test suite for the config module used in the application.
 *
 * This test suite covers the following functionality:
 *  - Checking if the environment is set to test mode
 *  - Verifying the exported environment variables PORT, SECRET_KEY, 
 *    BCRYPT_WORK_FACTOR, IS_TESTING, and the function getDatebaseUri
 *  - Testing different scenarios for the getDatebaseUri function
 *
 * Each piece of functionality is tested using the Jest testing framework, with
 * a series of unit tests that verify both the existence and correct typing of 
 * the exported variables and function, as well as the correct behavior of the 
 * getDatebaseUri function under different environment configurations.
 *
 * Test Cases:
 *
 * 1. 'IS_TESTING':
 *     - Verify that the environment is correctly detected as being in test mode
 *
 * 2. 'config.js exports':
 *     - Verify that the PORT, SECRET_KEY, BCRYPT_WORK_FACTOR, and IS_TESTING 
 *       environment variables are exported correctly
 *     - Verify that the getDatebaseUri function is exported correctly
 *
 * 3. 'getDatebaseUri':
 *     - Verify that the function returns the DATABASE_URL environment variable 
 *       if it exists
 *     - Verify that the function uses the test database when IS_TESTING is true
 *     - Verify that the function correctly constructs a connection string from 
 *       the database environment variables if no DATABASE_URL environment variable exists
 */
const { PORT, SECRET_KEY, BCRYPT_WORK_FACTOR, IS_TESTING, getDatebaseUri } = require('./config')

describe('Testing Environment Suite', () => {
    it('checks that the environment is set to test', () => {
        expect(IS_TESTING).toBeTruthy()
    })
})

describe('config.js', () => {
    it('should export the PORT environment variable', () => {
        expect(PORT).toBeDefined()
        expect(typeof PORT).toBe('number')
    })

    it('should export the SECRET_KEY environment variable', () => {
        expect(SECRET_KEY).toBeDefined()
        expect(typeof SECRET_KEY).toBe('string')
    })

    it('should export the BCRYPT_WORK_FACTOR environment variable', () => {
        expect(BCRYPT_WORK_FACTOR).toBeDefined()
        expect(typeof BCRYPT_WORK_FACTOR).toBe('number')
    })

    it('should export the IS_TESTING environment variable', () => {
        expect(IS_TESTING).toBeDefined()
        expect(typeof IS_TESTING).toBe('boolean')
    })

    it('should export getDatabaseUri function', () => {
        expect(getDatebaseUri).toBeDefined()
    })
})

describe('getDatabaseUri', () => {
    it('should return the DATABASE_URL environment variable if it exists', () => {
        process.env.NODE_ENV = 'mockProduction'
        process.env.DATABASE_URL = 'mockURL'

        const uri = getDatebaseUri()

        expect(uri).toBe('mockURL')
    })

    it('should use the test database when IS_TESTING is true', () => {
        process.env.NODE_ENV = 'test'
        process.env.DATABASE_URL = 'mockURL'

        const uri = getDatebaseUri()

        expect(uri).toBe('postgresql://postgres:postgres@localhost/testingURL')
    })

    it(`should combine the database environment variables into a connection string 
        if no DATABASE_URL environment variable exists`, () => {
        delete process.env.DATABASE_URL
        process.env.NODE_ENV = 'mockProduction'
        process.env.DATABASE_HOST = 'localhost'
        process.env.DATABASE_PORT = '5432'
        process.env.DATABASE_NAME = 'mockDBName'

        const uri = getDatebaseUri()

        expect(uri).toBe('postgresql://postgres:postgres@localhost:5432/mockDBName')
    })
})

module.exports = IS_TESTING