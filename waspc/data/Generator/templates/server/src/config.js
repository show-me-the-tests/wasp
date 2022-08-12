{{={= =}=}}
import { formatErrorString, deepMergeObjects } from './utils.js'

const env = process.env.NODE_ENV || 'development'

// TODO:
//   - Use dotenv library to consume env vars from a file.
//   - Use convict library to define schema and validate env vars.
//  https://codingsans.com/blog/node-config-best-practices

const config = {
  all: {
    env,
    port: parseInt(process.env.PORT) || 3001,
    databaseUrl: process.env.DATABASE_URL,
    {=# isAuthEnabled =}
    auth: {
      jwtSecret: undefined
    },
    {=/ isAuthEnabled =}
  },
  development: {
    {=# isAuthEnabled =}
    auth: {
      jwtSecret: 'DEVJWTSECRET'
    },
    {=/ isAuthEnabled =}
  },
  production: {
    {=# isAuthEnabled =}
    auth: {
      jwtSecret: process.env.JWT_SECRET
    },
    {=/ isAuthEnabled =}
  }
}

const resolvedConfig = deepMergeObjects(config.all, config[env])

configChecks(resolvedConfig)

export default resolvedConfig

function configChecks(_config) {
  const isPostgresUsed = {= isPostgresUsed =}

  if (isPostgresUsed && !process.env.DATABASE_URL) {
    const errorStr = formatErrorString([
      'No DATABASE_URL environment variable was found! This is required when using PostgreSQL.',
      'Please set this and try again. Ref: https://wasp-lang.dev/docs/language/features#env'
    ])
    throw errorStr
  }
}
