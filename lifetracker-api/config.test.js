/**
 * @fileoverview This module performs a suite of tests on the 'config' module, 
 * verifying that all the expected environment variables and functions are 
 * correctly exported and work as expected. 
 * 
 * The Jest testing framework is used for these tests. They include:
 * - Tests to verify that each of the expected environment variables (`PORT`, 
 *   `SECRET_KEY`, `BCRYPT_WORK_FACTOR`, and `IS_TESTING`) is exported by the 
 *   'config' module.
 * - Tests to verify that the `getDatabaseUri` function is exported and 
 *   correctly constructs the database URI based on the environment variables.
 *
 * @module config.test
 * @requires jest
 * @requires module:config
 *
 * @exports IS_TESTING
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