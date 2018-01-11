import * as Router from 'koa-router'
import { Response } from './interfaces'

const generateResponse = async (ctx: any, handler: (request: Router.IRouterContext, ctx?: any) => Promise<Response | void>) => {
  const response = await handler(ctx.request, ctx)
  if (!!response) {
    const { body, status } = response;
    ctx.type = 'application/json'
    ctx.body = !!body ? body : ctx.body
    ctx.status = !!status ? status : ctx.status
  }
}

export default generateResponse