require('dotenv').config();

module.exports = {
  // npx knex init if knex is not installed globally

  development: {
    client: 'pg',
    connection: process.env.DEV_URL,
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds/dev',
    },
    useNullAsDefault: true,
  },

  testing: {
    client: 'pg',
    connection: process.env.TEST_URL,
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds/test',
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'pg',
    connection: process.env.STAG_URL,
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds/staging',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    connection: process.env.PROD_URL,
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds/production',
    },
    useNullAsDefault: true,
  },

  onUpdateTrigger: (table) => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `,

  updateTrigger: () => `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS trigger AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
  $$ language 'plpgsql';
  `,
};
