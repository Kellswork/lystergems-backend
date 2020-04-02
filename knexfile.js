require('dotenv').config()
module.exports = {
  //npx knex init if knex is not installed globally
  // once this file is setup, we move to migrations
  development: {
    client: 'pg',
    connection: 'postgresql://lambda:kissme22@localhost:5432/shopping-site',
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds/dev'
    },
    useNullAsDefault: true
  },

  testing: {
    client: 'pg',
    connection: process.env.TEST_URL,
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds/test'
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'pg',
    connection: process.env.STAG_URL,
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds/staging'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: process.env.PROD_URL,
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds/production'
    },
    useNullAsDefault: true
  },
};