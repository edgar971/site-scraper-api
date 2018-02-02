import { IRouterContext } from 'koa-router'
import { Response } from '../../common/koa-utils/interfaces';
import { ok, badRequest, unauthorized } from '../../common/koa-utils/responses'
import { getSites } from 'common/repositories/sites'

export async function handleGet(request: IRouterContext): Promise<Response>  {
  const sites = await getSites()
  console.log(sites)
  return ok({ 
    data: sites
  })
}