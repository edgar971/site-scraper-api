import { IRouterContext } from 'koa-router'
import { Response } from '../../common/koa-utils/interfaces';
import { ok, badRequest, unauthorized } from '../../common/koa-utils/responses'

export async function handleGet(request: IRouterContext): Promise<Response>  {
  return ok({ 
    data: ['edgar', 'pino']
  })
}