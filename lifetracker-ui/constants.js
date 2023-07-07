/**
 * @fileoverview This file exports constants that are used to configure the base URL for API calls.
 * @module constants
 * @exports PRODUCTION_API_BASE_URL - The base URL of the API when the app is running in a production environment.
 * @exports DEVELOPMENT_API_BASE_URL - The base URL of the API when the app is running in a development environment.
 * @exports API_BASE_URL - The base URL that should be used for API calls, determined based on the current environment.
 */

export const PRODUCTION_API_BASE_URL = 'https://lifetracker-qqyg.onrender.com'
export const DEVELOPMENT_API_BASE_URL = 'http://localhost:3001'
export const API_BASE_URL =
    process.env.NODE_ENV === 'production'
        ? PRODUCTION_API_BASE_URL
        : DEVELOPMENT_API_BASE_URL
