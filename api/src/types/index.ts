import Router from 'koa-tree-router'
import { Client } from 'pg'
import { SensorInfo } from 'src/db/sensor'


export interface DB {
  client: Client
  sensorInfo: SensorInfo
}

export interface CustomContext extends Router.IRouterContext {
  db: DB
}