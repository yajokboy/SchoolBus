import cors from '@koa/cors'
import { APIGatewayEvent, Context } from 'aws-lambda'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-tree-router'
import serverless from 'serverless-http'
import HttpStatusCode from '../enums/httpStatusCode'
import sms from '../service/sms'
//import { authorize } from '../middleware/auth'
//import { db } from '../../../middleware/db'

const app = new Koa()
const router = new Router()

router.get('/test', async function (ctx: Context) {
  console.log("Hello test")
  ctx.body = "Hello School Bus"
  ctx.status = HttpStatusCode.OK
})

router.get('/getHornAlarm', async function (ctx: Context) {
  ctx.body = 1
  ctx.status = HttpStatusCode.OK
})

router.get('/getMovementAlarm', async function (ctx: Context) {
  ctx.body = 0
  ctx.status = HttpStatusCode.OK
})

router.get('/setHornAlarm', async function (ctx: Context) {
  const { value } = ctx.request.query
  if ( value !=  0 ||  value !=  1) {
    ctx.status = HttpStatusCode.BAD_REQUEST
    return 
  ctx.status = HttpStatusCode.OK
})

router.get('/setMovementAlarm', async function (ctx: Context) {
  const { value } = ctx.request.query
  if ( value !=  0 ||  value !=  1) {
    ctx.status = HttpStatusCode.BAD_REQUEST
    return 
  ctx.status = HttpStatusCode.OK
})

router.get('/sendSMS', async function (ctx: Context) {
    try {
      const { number, message } = ctx.request.query
      if (typeof number !== 'string' || typeof message !== 'string') {
        ctx.status = HttpStatusCode.BAD_REQUEST
        return
      }
      await sms.send(number,message)
      ctx.status = HttpStatusCode.OK

    } catch (e) {
      ctx.body = { error: e.message }
      return (ctx.status = HttpStatusCode.BAD_REQUEST)
    }
  })

app.use(cors())
app.use(bodyParser())
//app.use(authorize)
//app.use(db)
app.use(router.routes())

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return await serverless(app)(event, context)
}