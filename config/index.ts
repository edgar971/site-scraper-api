import { Config } from './interfaces'
const database = require('./database.json')
const config = require('./config.json') as Config
const env = process.env.ENV || config.env

config.database = database[env]

export default config