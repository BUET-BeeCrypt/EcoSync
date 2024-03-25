require('dotenv').config();
const axios = require('axios');

const baseApi = axios.create({
    baseURL: (process.env.BASE_API_URL || 'http://localhost:8000') + '/api',
    validateStatus: status => status >= 200 && status < 500
});

module.exports = baseApi;