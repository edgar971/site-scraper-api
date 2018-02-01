import * as Koa from 'koa'
import sites from './sites'
import config from 'config'

const app = new Koa()
const port = config.web.port || 8888

app
  .use(require('koa-body')())
  .use(sites.routes())

app.listen(port, () => {
  console.info(`listening on port ${port}`)
})

