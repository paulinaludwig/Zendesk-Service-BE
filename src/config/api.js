const axios = require('axios');

axios.defaults.baseURL = process.env.ZENDESK_BASE_URL;
axios.defaults.headers.common['Authorization'] = process.env.APP_AUTH_BASIC;
