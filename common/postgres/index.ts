import { isNullOrUndefined } from 'util'
import { SQLStatement } from 'sql-template-strings'
import * as pgPromise from 'pg-promise'
import config from 'config'
import wrappedPgp from './wrapped-pgp'

let pgp
let database: Database

export default function connect(schema?: string) {
  if (isNullOrUndefined(database) || !isNullOrUndefined(schema)) {
    closeDatabase()
    pgp = wrappedPgp()
    database = pgp({
      ...config.database,
      database: !schema ? config.database.database : schema
    })
  }
  return database
}

export function closeDatabase() {
  if (!isNullOrUndefined(database)) {
    database = null
    pgp.end()
  }
}

declare module 'sql-template-strings' {
  interface SQLStatement {
    appendAll: (statements:(SQLStatement|string|number)[]) => SQLStatement
  }
}

SQLStatement.prototype.appendAll = function(statements:(SQLStatement|string|number)[]) {
  for (let i = 0; i < statements.length; i++) {
    this.append(statements[i])
      .append(i < statements.length - 1 ? ', ' : '')
  }
  return this
}

export type Database = pgPromise.IDatabase<any>
