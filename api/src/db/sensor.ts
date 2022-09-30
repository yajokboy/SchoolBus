import { Client } from 'pg'

export class SensorInfo {
       
      private client: Client
      constructor(client: Client) {
        this.client = client
      }
      
      async getSensorValue(sensorName: string):Promise<number> {
        const { rows: hash } = await this.client.query( 'SELECT value FROM sensorinfo WHERE sensorname = $1',
        [sensorName] )
          return  hash[0].value
        }

      async getCOSensorValue():Promise<number> {
        const { rows: hash } = await this.client.query( 'SELECT value FROM coinfo order by date desc')
            return  hash[0].value
        }    
      async getCOSensorValueSeries(period: string):Promise<number> {
          const { rows: hash } = await this.client.query( `SELECT to_char(date,'yyyy-MM-dd HH24:mm:ss') As datetime, value FROM coinfo WHERE date >= now() - interval '${period}' order by date asc`)
          //SELECT '2022-04-09 10:36:19'::timestamp AT TIME ZONE 'America/Los_Angeles';
          return  hash
          }  
    
      async setSensorValue(sensorName: string, value:number){
        const updateValue = await this.client.query(
            'UPDATE sensorinfo SET value = $2 WHERE sensorname = $1',[sensorName, value]
          )        
      }
      async setCOSensorValue(value:number){
        const insertValue = await this.client.query(`INSERT INTO coinfo (date,value) VALUES (now()+ interval '7 hour',$1)`,[value])        
      }
}

