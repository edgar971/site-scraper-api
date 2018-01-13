import * as Sequelize from 'sequelize'
import { isNullOrUndefined } from 'util'
import config from '../../config'

let sequelize

export default function connect() {
  if (isNullOrUndefined(sequelize)) {
    sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, { ...config.database })
  }
  return sequelize
}

export function closeDatabase() {
  if (!isNullOrUndefined(sequelize)) {
    sequelize.close()
    sequelize = null
  }
}