module.exports = {
//npx knex init if knex is not installed globally
// once this file is setup, we move to migrations
  development: {
    client: 'pg',
    connection: process.env.DEV_URL,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  
  testing: {
    client: 'pg',
   connection: process.env.TEST_URL,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'pg',
   connection: process.env.STAG_URL,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/staging'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: process.env.PROD_URL,
    migrations: {
      directory: '/.db/migrations'
    },
    seeds: {
      directory: '/.db/seeds/production'
    },
    useNullAsDefault: true
  },

};
