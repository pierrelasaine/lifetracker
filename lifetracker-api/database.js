/**
 * @fileoverview This module sets up a connection to a PostgreSQL database, 
 * using connection parameters from the config module. It creates a new 
 * PostgreSQL client and exports this connected client for use in other modules.
 * 
 * The `getDatabaseUri` function from the config module is used to get the 
 * connection string for the database.
 * 
 * The `Client` class from the `pg` module is used to create a new database 
 * client.
 *
 * The `connectToPostgreSQL` function is an asynchronous function that attempts
 * to connect to the database using the client and logs a message to the 
 * terminal on success or failure.
 * 
 * @module db
 * @requires module:pg
 * @requires module:config
 * 
 * @exports client
 */
const { getDatabaseUri } = require("./config")
const { Client } = require("pg")

const databaseUri = getDatabaseUri

// Create a new PostgreSQL client
const client = new Client({
  connectionString: databaseUri,
})

/**
 * Asynchronous function to connect to the PostgreSQL database using the client.
 * 
 * It logs a success message to the terminal if the connection is successful,
 * or an error message if the connection fails.
 */
const connectToPostgreSQL = async () => {
  try {
    await client.connect()
    console.log('🚀 Connected to PostgreSQL 🚀')
  } catch (error) {
    console.error('🚨Failed to connect to PostgreSQL🚨:', error)
  }
}

// Connect to PostgreSQL and log a message to the terminal on success or failure
connectToPostgreSQL()

// Export the connected database client
module.exports = client