import * as pgPromise from 'pg-promise'

export default function wrappedPgp() {
  return pgPromise() 
}