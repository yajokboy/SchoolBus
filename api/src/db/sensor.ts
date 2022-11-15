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
          const { rows: hash } = await this.client.query( `SELECT to_char(date,'yyyy-MM-dd HH24:mi:ss') As datetime, value FROM coinfo WHERE date >= now() + interval '7 hour' - interval '${period}' order by date asc`)
          //SELECT '2022-04-09 10:36:19'::timestamp AT TIME ZONE 'America/Los_Angeles';'7 hour'
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
        
        let CoAlarmFlg = 0
        const nowTime = new Date().getTime()//.toJSON();
        const startTime5Min = new Date(nowTime + (7*60*60*1000)- (5*60*1000));
        const startTime2Min = new Date(nowTime + (7*60*60*1000)- (2*60*1000));
        /////////// Calculation case 5 min //////////////
        console.log('startTime5Min:'+startTime5Min)
        const { rows: hash5min } = await this.client.query( `SELECT date, value FROM coinfo WHERE date >= now() + interval '7 hour' - interval '5 MINUTES' - interval '10 SECONDS'  order by date desc`)
        const CoTime5 = hash5min.map((item) => item.date)
        const CoLast5 = hash5min.map((item) => item.value)
        const sizeCoTime5 = CoTime5.length;
        if(sizeCoTime5 > 0){
          const firstTime5 = CoTime5[sizeCoTime5-1];
          console.log('firstTime5:'+firstTime5)
          if(firstTime5<startTime5Min){
            const start_value_5min = CoLast5[sizeCoTime5-1];
            const last_value_5min = CoLast5[0];
            let diff_Value_of_5min = last_value_5min-start_value_5min;
            console.log('Diff Value of 5 min =',diff_Value_of_5min)
            const diff_criteria_5min = 200
            if(diff_Value_of_5min>diff_criteria_5min){
              CoAlarmFlg = 1
            }
          }     
        }
        /////////// Calculation case 2 min //////////////
        console.log('startTime2Min:'+startTime2Min)
        const { rows: hash2min } = await this.client.query( `SELECT date, value FROM coinfo WHERE date >= now() + interval '7 hour' - interval '2 MINUTES' - interval '10 SECONDS'  order by date desc`)
        const CoTime2 = hash2min.map((item) => item.date)
        const CoLast2 = hash2min.map((item) => item.value)
        const sizeCoTime2 = CoTime2.length;
        if(sizeCoTime2 > 0){
          const firstTime2 = CoTime2[sizeCoTime2-1];
          console.log('firstTime2:'+firstTime2)
          if(firstTime2<startTime2Min){
            const start_value_2min = CoLast2[sizeCoTime2-1];
            const last_value_2min = CoLast2[0];
            let diff_Value_of_2min = last_value_2min-start_value_2min;
            console.log('Diff Value of 2 min =',diff_Value_of_2min)
            const diff_criteria_2min = 120
            if(diff_Value_of_2min>diff_criteria_2min){
              CoAlarmFlg = 1
            }
          }     
        }
        //////////////////////////////////////////////////////////
        console.log('CoAlarmFlg=',CoAlarmFlg)
        return CoAlarmFlg
        } 
}

