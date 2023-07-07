/**
 * @fileoverview API client for interacting with backend API.
 * @module services/apiClient
 * @requires axios - Promise based HTTP client for the browser and node.js.
 * @requires ../constants - Module containing the API base URL depending on the environment.
 * @exports ApiClient - Main class that contains methods for making API requests.
 */

import axios from 'axios'
import { API_BASE_URL } from '../constants'

class ApiClient {
    /**
     * @constructs ApiClient
     * @param {string} remoteHostUrl - The base URL of the API.
     */
    constructor(remoteHostUrl) {
        this.remoteHostUrl = remoteHostUrl
        this.token = null
    }

    /**
     * @method setToken
     * @param {string} token - JWT token for authentication.
     * @returns {void}
     */
    setToken(token) {
        this.token = token
    }

    /**
     * @method request
     * @param {Object} config - Configuration object for the request.
     * @param {string} config.endpoint - The API endpoint to hit.
     * @param {('GET'|'POST'|'PUT'|'DELETE')} config.method - The HTTP method to use.
     * @param {Object} [config.data] - Data to send with the request.
     * @returns {Promise<Object>} - The response from the server.
     */
    async request({ endpoint, method, data = {} }) {
        const url = `${this.remoteHostUrl}/${endpoint}`
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        }

        try {
            const res = await axios({ url, method, data, headers })
            return { data: res.data, error: null }
        } catch (error) {
            console.error(error.response.status, error.response.data.error)
            return { data: null, error: error.response.data.error }
        }
    }

    /**
     * @method login
     * @param {Object} credentials - The login credentials of the user.
     * @param {string} credentials.email - The email address of the user.
     * @param {string} credentials.password - The password of the user.
     * @returns {Promise<Object>} - The response from the server.
     */
    async login(credentials) {
        return this.request({
            endpoint: 'auth/login',
            method: 'POST',
            data: credentials
        })
    }

    /**
     * @method signup
     * @param {Object} credentials - The registration credentials of the user.
     * @param {string} credentials.username - The username of the user.
     * @param {string} credentials.password - The password of the user.
     * @param {string} credentials.firstName - The first name of the user.
     * @param {string} credentials.lastName - The last name of the user.
     * @param {string} credentials.email - The email address of the user.
     * @returns {Promise<Object>} - The response from the server.
     */
    async register(credentials) {
        return this.request({
            endpoint: 'auth/register',
            method: 'POST',
            data: credentials
        })
    }

    /**
     * @method fetchUserFromToken
     * @returns {Promise<Object>} - The response from the server.
     */
    async fetchUserFromToken() {
        return this.request({ endpoint: 'auth/me', method: 'GET' })
    }

    /**
     * @method fetchNutritionList
     * @returns {Promise<Object>} - The response from the server.
     */
    async fetchNutritionList() {
        return this.request({ endpoint: 'nutrition', method: 'GET' })
    }

    /**
     * @method addNutritionEntry
     * @param {Object} nutrition - The nutrition entry to be added.
     * @param {string} nutrition.name - The name of the nutrition entry.
     * @param {string} nutrition.category - The category of the nutrition entry.
     * @param {number} nutrition.calories - The number of calories in the nutrition entry.
     * @param {string} nutrition.image_url - The image URL of the nutrition entry.
     * @returns {Promise<Object>} - The response from the server.
     */
    async addNutritionEntry(nutrition) {
        return this.request({
            endpoint: 'nutrition',
            method: 'POST',
            data: { nutrition: nutrition }
        })
    }

    /**
     * @method fetchNutritionEntry
     * @param {string} nutritionId - The ID of the nutrition entry to fetch.
     * @returns {Promise<Object>} - The response from the server.
     */
    async fetchNutritionEntry(nutritionId) {
        return this.request({
            endpoint: `nutrition/${nutritionId}`,
            method: 'GET'
        })
    }

    /**
     * @method fetchActivityStats
     * @returns {Promise<Object>} - The response from the server.
     */
    async fetchActivityStats() {
        return this.request({ endpoint: 'activity', method: 'GET' })
    }
}

export default new ApiClient(API_BASE_URL)
