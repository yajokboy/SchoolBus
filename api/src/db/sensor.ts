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
    
      async setSensorValue(sensorName: string, value:number){
        const updateValue = await this.client.query(
            'UPDATE sensorinfo SET value = $2 WHERE sensorname = $1',[sensorName, value]
          )        
      }

    
}

