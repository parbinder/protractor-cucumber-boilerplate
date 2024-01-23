import { TelemetrySQLConnector } from "./sql_connector"
import * as sql from 'mssql'
import { TelemetrySQLQueries } from "./telemetry_sql_queries"
import { log4jsconfig } from "../log4js_config/log4jsconfig"
import { FeatureScenarioStatCalulator } from "./feature_scenario_stat_counter"

enum TelemetrySQLConstantQueries {
    GET_MODULE_LIST  = 'SELECT MODULE_NAME from AUTOMATED_MODULES ORDER BY MODULE_NAME',
}

export class TelemetryDAO {
    
    private telemetrySQLInjector = new TelemetrySQLConnector()
    
    public updateAutomatedModuleList = async(moduleList: string[]) => {

        const connection = new TelemetrySQLConnector()
        const moduleListFromDatabase: string[] | undefined = (await connection.execute(TelemetrySQLConstantQueries.GET_MODULE_LIST))?.recordset
        const refinedModuleList: string[] = []
        
        if(moduleListFromDatabase && moduleListFromDatabase.length !== 0) {
            moduleListFromDatabase.forEach((entry:any) => {
                refinedModuleList.push(entry['MODULE_NAME'])
            })
        }
        
        moduleList.forEach(async (moduleName) => {
            if(moduleListFromDatabase && moduleListFromDatabase.length === 0 ||  !refinedModuleList.includes(moduleName)) {
                await this.insertModuleToAutomatedModulesTable(moduleName)
            }
        })
    }
    
    /**
     * 
     * @param moduleName Updates a module as a row in AUTOMATED_MODULES table
     * @returns IResult object containing module identifier from database 
     */
    public async insertModuleToAutomatedModulesTable(moduleName: string): Promise<any> {
            
        return await new TelemetrySQLConnector().execute(
            `INSERT INTO AUTOMATED_MODULES (MODULE_NAME) VALUES('${moduleName}');SELECT SCOPE_IDENTITY() AS id;`
            );
    }

    public async insertFeatureScenarioCountStats(module: string) {
        
        return await new TelemetrySQLConnector().execute(
            `
            BEGIN
	            IF NOT EXISTS (SELECT * FROM FEATURE_SCENARIO_COUNT_OVER_TIME WHERE MODULE = (SELECT ID FROM AUTOMATED_MODULES where MODULE_NAME = '${module}') AND FEATURE_COUNT = (SELECT COUNT(*) FROM FEATURE_LIST WHERE MODULE = (SELECT ID FROM AUTOMATED_MODULES WHERE MODULE_NAME='${module}')) AND SCENARIO_COUNT = (SELECT COUNT(*) FROM SCENARIO_LIST WHERE FEATURE_ID IN (SELECT ID FROM FEATURE_LIST WHERE MODULE = (SELECT ID FROM AUTOMATED_MODULES WHERE MODULE_NAME = '${module}'))))
                    BEGIN
                        INSERT INTO FEATURE_SCENARIO_COUNT_OVER_TIME(MODULE, FEATURE_COUNT, SCENARIO_COUNT) VALUES((SELECT ID FROM AUTOMATED_MODULES where MODULE_NAME = '${module}'), (SELECT COUNT(*) FROM FEATURE_LIST WHERE MODULE = (SELECT ID FROM AUTOMATED_MODULES WHERE MODULE_NAME='${module}')), (SELECT COUNT(*) FROM SCENARIO_LIST WHERE FEATURE_ID IN (SELECT ID FROM FEATURE_LIST WHERE MODULE = (SELECT ID FROM AUTOMATED_MODULES WHERE MODULE_NAME = '${module}')))); 
                    END
            END
            `
            );
    }

    public async insertTotalFeatureScenarioCountStats() {
        
        return await new TelemetrySQLConnector().execute(
            `
            BEGIN
	            IF NOT EXISTS (SELECT * FROM FEATURE_SCENARIO_COUNT_OVER_TIME WHERE MODULE = -1 AND FEATURE_COUNT = (SELECT COUNT(*) FROM FEATURE_LIST) AND SCENARIO_COUNT = (SELECT COUNT(*) FROM SCENARIO_LIST))
                    BEGIN
                        INSERT INTO FEATURE_SCENARIO_COUNT_OVER_TIME(MODULE, FEATURE_COUNT, SCENARIO_COUNT) VALUES(-1, (SELECT COUNT(*) FROM FEATURE_LIST), (SELECT COUNT(*) FROM SCENARIO_LIST)); 
                    END
            END
            `
            );   
    }
                
    public async updateFeatureListTable(module: string, featureName: string) {
        return await new TelemetrySQLConnector().execute(
            `BEGIN
                IF NOT EXISTS (SELECT * FROM FEATURE_LIST WHERE FEATURE_NAME = '${featureName}')
                    BEGIN
                        INSERT INTO FEATURE_LIST (MODULE, FEATURE_NAME) VALUES ((SELECT ID FROM AUTOMATED_MODULES where MODULE_NAME = '${module}'), '${featureName}'); SELECT SCOPE_IDENTITY() AS ID; 
                    END
                ELSE
                    SELECT ID FROM FEATURE_LIST WHERE FEATURE_NAME = '${featureName}'
            END`
        )
    }

    private async updateScenarioListTable(featureId: number, scenarioName: string) {

        return await new TelemetrySQLConnector().execute(
            `
            BEGIN
                IF NOT EXISTS (SELECT * FROM SCENARIO_LIST WHERE FEATURE_ID = ${featureId} AND SCENARIO_NAME = '${scenarioName}')
                    BEGIN
                        INSERT INTO SCENARIO_LIST (FEATURE_ID, SCENARIO_NAME) VALUES (${featureId}, '${scenarioName}')
                    END
                ELSE
		            SELECT ID as id FROM SCENARIO_LIST WHERE FEATURE_ID = ${featureId} AND SCENARIO_NAME = '${scenarioName}'
            END
            `
        )
    }
    
    private async insertTags(tagName: string) {

        return await new TelemetrySQLConnector().execute(
            `
            BEGIN
                IF NOT EXISTS (SELECT * FROM TAG_LIST WHERE TAG = '${tagName}')
                    BEGIN 
                        INSERT INTO TAG_LIST (TAG) VALUES('${tagName}');SELECT SCOPE_IDENTITY() AS ID; 
                    END 
                ELSE SELECT ID AS id FROM TAG_LIST WHERE TAG = '${tagName}'
            END
            `
        ) 
    }
    
    private async insertScenarioTagRelations(scenarioName: string, tagId: number) {

        return await new TelemetrySQLConnector().execute(
            `
            BEGIN
                IF NOT EXISTS (SELECT * FROM TAG_SCENARIO_LINKAGE WHERE TAG_ID = ${tagId} AND SCENARIO_ID = (SELECT ID FROM SCENARIO_LIST WHERE SCENARIO_NAME = '${scenarioName}'))
                    BEGIN
                        INSERT INTO TAG_SCENARIO_LINKAGE (TAG_ID, SCENARIO_ID) VALUES(${tagId}, (SELECT ID FROM SCENARIO_LIST WHERE SCENARIO_NAME = '${scenarioName}'));SELECT SCOPE_IDENTITY() AS ID;
                    END
            END

            `
        )
    }

    public async pushTagDetails() {
        FeatureScenarioStatCalulator.tagList.forEach(async (tagEntry) => {

            const tags = tagEntry[0].split(',')
            const scenarioName = tagEntry[1]

            tags.forEach(async (tag) => {
                
                if(tag.length > 0 && scenarioName.length > 0) {
                    const result: any = await this.insertTags(tag)
                    await this.insertScenarioTagRelations(scenarioName, result?.recordset[0].id)
                }
            })
        }) 
    }

    
    public async updateFeatureScenarioStats(featureScenarioCountDetails: any) {
        
        try {
            for(const module in featureScenarioCountDetails) {
           
                await this.insertFeatureScenarioCountStats(module)
                
                for(const featureObj in featureScenarioCountDetails[module].scenarioList) {

                    const result:any = await this.updateFeatureListTable(module, featureScenarioCountDetails[module].scenarioList[featureObj].feature)
                    
                    for(const scenario in featureScenarioCountDetails[module].scenarioList[featureObj].scenariosList) {                       
                        await this.updateScenarioListTable(Number(result?.recordset[0].ID), featureScenarioCountDetails[module].scenarioList[featureObj].scenariosList[scenario])
                    }
                }
            }
        }

        catch(e: any) {
            log4jsconfig.log().error(e.toString());
        }
    }
}