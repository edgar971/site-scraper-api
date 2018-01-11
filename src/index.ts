import * as Koa from 'koa'
import sites from './sites'

const app = new Koa()
const port = 8888

app
  .use(require('koa-body')())
  .use(sites.routes())

app.listen(port, () => {
  console.info(`listening on port ${port}`)
})

