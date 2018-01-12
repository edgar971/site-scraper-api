import { Config } from './interfaces'
const database = require('./database.json')
const config = require('./config.json') as Config

config.database = database[config.env]

export default config