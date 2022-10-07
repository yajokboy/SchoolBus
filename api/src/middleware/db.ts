import Koa from 'koa'
import { Client } from 'pg'
import { SensorInfo } from 'src/db/sensor'
import { CustomContext } from 'src/types'


async function connectDB() {

  const client = new Client({
    user: 'root',
    host: 'school-bus-database.cbftehx71xxg.ap-southeast-1.rds.amazonaws.com',
    database: 'sensorDB',
    password: 'password',
    port: 5432,
  })
  await client.connect()
  const sensorInfo = new SensorInfo(client)
  return {
    client,
    sensorInfo,
  }
}
export async function db(ctx: CustomContext, next: Koa.Next) {
  ctx.db = await connectDB()
  await next()
  await ctx.db.client.end()
}
