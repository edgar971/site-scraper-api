import { Response } from './interfaces'

function error(errors: string[], status: number): Response {
  return { body: {
    errors
  }, status }
}

export function ok(body?: any): Response {
   return { body, status: 200 }
}

export function created(body: any): Response {
   return { body, status: 201 }
}

export function notFound(body: any): Response {
   return { body, status: 404 }
}

export function badRequest(errors: string[]): Response {
  return error(errors, 400)
}

export function unauthorized(errors: string[]): Response {
  return error(errors, 401)
}