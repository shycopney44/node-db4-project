const knex = require('knex');
const configuration = require('../knexfile.js');
const environment = process.env.NODE_ENV || 'development';

module.exports = knex(configuration[environment]);