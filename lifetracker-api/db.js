/**
 * Database Connection Module
 * 
 * This module establishes a connection to a PostgreSQL database using the 
 * configuration provided by the config.js module. It exports the connected 
 * database client for use in other parts of the application.
 */
const { getDatabaseUri } = require("./config")
const { Client } = require("pg")

const databaseUri = getDatabaseUri()

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
async function connectToPostgreSQL() {
  try {
    await client.connect()
    console.log('🚀 Connected to PostgreSQL 🚀')
  } catch (error) {
    console.error('🚨Failed to connect to PostgreSQL🚨:', error)
  }
}

// Connect to PostgreSQL and log a message to the terminal on success or failure
connectToPostgreSQL();

// Export the connected database client
module.exports = client;