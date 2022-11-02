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
          const { rows: hash } = await this.client.query( `SELECT to_char(date,'yyyy-MM-dd HH24:mi:ss') As datetime, value FROM coinfo WHERE date >= now() - interval '${period}' order by date asc`)
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

      async CoSensorCheck():Promise<number>{
        const { rows: hash } = await this.client.query( `SELECT value FROM coinfo order by date desc LIMIT 10`)
        const CoLast10 = hash.map((item) => item.value)
        let upTrendCount = 0
        let lastHighValue = 0
        let CoAlarmFlg = 0
        CoLast10.reverse()
        for (let i = 0; i < CoLast10.length; i++) {
          if (CoLast10[0] > 1200){
            if (lastHighValue < CoLast10[i]){
              upTrendCount++;
              lastHighValue = CoLast10[i] 
            }
          }
        }
        if(upTrendCount>=7)
        {
          CoAlarmFlg = 1
        }
        console.log('CoLast10=',CoLast10)
        console.log('upTrendCount=',upTrendCount)
        console.log('CoAlarmFlg=',CoAlarmFlg)
        return CoAlarmFlg
        } 
}

