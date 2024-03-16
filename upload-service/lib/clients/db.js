const knex = require('knex')

const connectionConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

const client = knex({
    client: 'pg',
    connection: connectionConfig,
})

module.exports = client;