import * as Router from 'koa-router'
import generateResponse from '../../common/koa-utils/generate-response';
import { handleGet } from './handlers';

const router = new Router()

router.get('/v2/sites', (ctx: any) => generateResponse(ctx, handleGet))

export default router
