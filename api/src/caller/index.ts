import cors from '@koa/cors'
import { APIGatewayEvent, Context } from 'aws-lambda'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-tree-router'
import serverless from 'serverless-http'
import { db } from 'src/middleware/db'
import { CustomContext } from 'src/types'
import HttpStatusCode from '../enums/httpStatusCode'
import sms from '../service/sms'
//import { authorize } from '../middleware/auth'


const app = new Koa()
const router = new Router()

router.get('/test', async function (ctx: CustomContext) {
  console.log("Hello test")
  //ctx.body = "Hello School Bus"
  ctx.body = await ctx.db.sensorInfo.getCOSensorlast5value()
  ctx.status = HttpStatusCode.OK
})
router.get('/sendSMS', async function (ctx: CustomContext) {
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

router.get('/getHornAlarm', async function (ctx: CustomContext) {
  try {
    ctx.body = await ctx.db.sensorInfo.getSensorValue('Horn')
    ctx.status =  HttpStatusCode.OK
  } catch (e) {
    ctx.body = { error: e.message }
    ctx.status = HttpStatusCode.BAD_REQUEST
  }
  
})

router.get('/getCoAlarm', async function (ctx: CustomContext) {
  try {
    ctx.body = await ctx.db.sensorInfo.getSensorValue('CO')
    ctx.status =  HttpStatusCode.OK
  } catch (e) {
    ctx.body = { error: e.message }
    ctx.status = HttpStatusCode.BAD_REQUEST
  }
  
})


router.get('/setHornAlarm', async function (ctx: CustomContext) {
  const { value } = ctx.request.query
  if ( value === '0' ||  value === '1') 
  {
    ctx.body = await ctx.db.sensorInfo.setSensorValue('Horn',Number(value)) 
    ctx.status = HttpStatusCode.OK
    return
   }
    else ctx.status = HttpStatusCode.BAD_REQUEST
  
  
})

router.get('/getMovementAlarm1', async function (ctx: CustomContext)  {
  try {
    ctx.body = await ctx.db.sensorInfo.getSensorValue('Movement1')
    ctx.status =  HttpStatusCode.OK
  } catch (e) {
    ctx.body = { error: e.message }
    ctx.status = HttpStatusCode.BAD_REQUEST
  }
  
})
router.get('/setMovementAlarm1', async function (ctx: CustomContext) {
  const { value } = ctx.request.query
  if  ( value === '0' ||  value === '1') {
    ctx.body = await ctx.db.sensorInfo.setSensorValue('Movement1',Number(value)) 
    ctx.status = HttpStatusCode.OK
    return }
    else ctx.status = HttpStatusCode.BAD_REQUEST
})

router.get('/getMovementAlarm2', async function (ctx: CustomContext)  {
  try {
    ctx.body = await ctx.db.sensorInfo.getSensorValue('Movement2')
    ctx.status =  HttpStatusCode.OK
  } catch (e) {
    ctx.body = { error: e.message }
    ctx.status = HttpStatusCode.BAD_REQUEST
  }
  
})
router.get('/setMovementAlarm2', async function (ctx: CustomContext) {
  const { value } = ctx.request.query
  if  ( value === '0' ||  value === '1') {
    ctx.body = await ctx.db.sensorInfo.setSensorValue('Movement2',Number(value)) 
    ctx.status = HttpStatusCode.OK
    return }
    else ctx.status = HttpStatusCode.BAD_REQUEST
})

router.get('/getMovementAlarm3', async function (ctx: CustomContext)  {
  try {
    ctx.body = await ctx.db.sensorInfo.getSensorValue('Movement3')
    ctx.status =  HttpStatusCode.OK
  } catch (e) {
    ctx.body = { error: e.message }
    ctx.status = HttpStatusCode.BAD_REQUEST
  }
  
})
router.get('/setMovementAlarm3', async function (ctx: CustomContext) {
  const { value } = ctx.request.query
  if  ( value === '0' ||  value === '1') {
    ctx.body = await ctx.db.sensorInfo.setSensorValue('Movement3',Number(value)) 
    ctx.status = HttpStatusCode.OK
    return }
    else ctx.status = HttpStatusCode.BAD_REQUEST
})

router.get('/getlastCO', async function (ctx: CustomContext)  {
  try {
    ctx.body = await ctx.db.sensorInfo.getCOSensorValue()
    ctx.status =  HttpStatusCode.OK
  } catch (e) {
    ctx.body = { error: e.message }
    ctx.status = HttpStatusCode.BAD_REQUEST
  }
  
})

router.get('/getCO', async function (ctx: CustomContext)  {
  try {
    
    ctx.body = await ctx.db.sensorInfo.getCOSensorValueSeries('24 HOURS')
    ctx.status =  HttpStatusCode.OK
  } catch (e) {
    ctx.body = { error: e.message }
    ctx.status = HttpStatusCode.BAD_REQUEST
  }
  
})

router.get('/setCO', async function (ctx: CustomContext) {
  const { value } = ctx.request.query
  try {
    ctx.body = await ctx.db.sensorInfo.setCOSensorValue(Number(value)) 
    const coAlarmFlg = await ctx.db.sensorInfo.CoSensorCheck()
    ctx.body = await ctx.db.sensorInfo.setSensorValue('CO',coAlarmFlg) 
    ctx.status = HttpStatusCode.OK
    return 
  } catch (e) {
    ctx.body = { error: e.message }
    ctx.status = HttpStatusCode.BAD_REQUEST
  }
  
})


router.get('/setSensorValue', async function (ctx: CustomContext) {
  const { Movement1, Movement2, Movement3, CO } = ctx.request.query
  try {
  if  ( Movement1 === '0' ||  Movement1 === '1') {
      ctx.body = await ctx.db.sensorInfo.setSensorValue('Movement1',Number(Movement1)) 
      ctx.status = HttpStatusCode.OK
      }
      else {
        ctx.status = HttpStatusCode.BAD_REQUEST
        return
      }

  if  ( Movement2 === '0' ||  Movement2 === '1') {
      ctx.body = await ctx.db.sensorInfo.setSensorValue('Movement2',Number(Movement2)) 
      ctx.status = HttpStatusCode.OK
       }
      else {
        ctx.status = HttpStatusCode.BAD_REQUEST
        return
      }

  if  ( Movement3 === '0' ||  Movement3 === '1') {
      ctx.body = await ctx.db.sensorInfo.setSensorValue('Movement3',Number(Movement3)) 
      ctx.status = HttpStatusCode.OK
       }
      else {
        ctx.status = HttpStatusCode.BAD_REQUEST
        return
      } 
  
  ctx.body = await ctx.db.sensorInfo.setCOSensorValue(Number(CO)) 
  const coAlarmFlg = await ctx.db.sensorInfo.CoSensorCheck()
  ctx.body = await ctx.db.sensorInfo.setSensorValue('CO',coAlarmFlg) 

  ctx.status = HttpStatusCode.OK

  return
  } catch (e) {
    ctx.body = { error: e.message }
    ctx.status = HttpStatusCode.BAD_REQUEST
  }
})


app.use(cors())
app.use(bodyParser())
//app.use(authorize)
app.use(db)
app.use(router.routes())

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return await serverless(app)(event, context)
}