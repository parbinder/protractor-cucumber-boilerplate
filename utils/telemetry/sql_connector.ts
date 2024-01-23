import * as sql from "mssql";
import { IResult } from "mssql";
import { log4jsconfig } from "../log4js_config/log4jsconfig";
import { AUTOMATION_TELEMETRY_DB } from "../protractor/Constant";


const config = {
  user: Buffer.from(AUTOMATION_TELEMETRY_DB.user, 'base64').toString(), //Give SQL username
  password: Buffer.from(AUTOMATION_TELEMETRY_DB.pass, 'base64').toString(), //Specify SQL password
  server: 'catonedev.database.windows.net',
  database: 'automation_telemetry',
}

/**
 * Connects to MSSQL server and executes provided SQL queries
 */
export class TelemetrySQLConnector {

  connectionPool: sql.ConnectionPool | undefined = undefined

  private connectionString: string

  /**
   * Connects to MSSQL server and executes provided SQL queries
   */
  constructor() {
      this.connectionString = `Server=${config.server},1433;Database=${config.database};User Id=${config.user};Password=${config.password};Encrypt=true`
  }

  /**
   * Executes provided SQL query. Method can return undefined, so best use a check on the returned output.
   * @param query String query to be executed on database 
   * @returns Undefined Object containing result of the executed query 
   */

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   public execute = async (query: string):Promise<IResult<any>| undefined>  => {

    try {
        await sql.connect(this.connectionString)
    }
    catch(e:any) {
      log4jsconfig.log().error(`Error while connecting to telemetry database - ${config.database}(Server - ${config.server}) \n ${e}`);
      
    }

    try {
        return await sql.query(query) 
    }
    catch(e: any) {
        log4jsconfig.log().error(`Error while executing query on telemetry database \n ${e} \n Failed query:\n ${query}`);    
    }
  }
}
