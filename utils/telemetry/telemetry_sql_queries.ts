export enum TelemetrySQLQueries {
    GET_MODULE_LIST  = 'SELECT MODULE_NAME from AUTOMATED_MODULES ORDER BY MODULE_NAME',
    INSERT_AUTOMATED_MODULES = 'INSERT INTO AUTOMATED_MODULES (MODULE_NAME) VALUES(@moduleName);SELECT SCOPE_IDENTITY() AS id;',
    INSERT_FEATURE_SCENARIO_COUNT_OVER_TIME = 
        `
        BEGIN
            IF NOT EXISTS (SELECT * FROM FEATURE_SCENARIO_COUNT_OVER_TIME WHERE MODULE = (SELECT ID FROM AUTOMATED_MODULES where MODULE_NAME = @module) AND FEATURE_COUNT = @featureCount AND SCENARIO_COUNT = @scenarioCount)
                BEGIN
                    INSERT INTO FEATURE_SCENARIO_COUNT_OVER_TIME(MODULE, FEATURE_COUNT, SCENARIO_COUNT) VALUES((SELECT ID FROM AUTOMATED_MODULES where MODULE_NAME = @module), @featureCount, @scenarioCount); 
                END
        END
        `,
    INSERT_TOTAL_FEATURE_SCENARIO_COUNT_OVER_TIME = 
        `
        BEGIN
	            IF NOT EXISTS (SELECT * FROM FEATURE_SCENARIO_COUNT_OVER_TIME WHERE MODULE = -1 AND FEATURE_COUNT = @totalFeatureCount AND SCENARIO_COUNT = @totalScenarioCount)
                    BEGIN
                        INSERT INTO FEATURE_SCENARIO_COUNT_OVER_TIME(MODULE, FEATURE_COUNT, SCENARIO_COUNT) VALUES(-1, @totalFeatureCount, @totalScenarioCount); 
                    END
            END
        `,
    UPDATE_FEATURE_LIST = 
        `
        BEGIN
            IF NOT EXISTS (SELECT * FROM FEATURE_LIST WHERE FEATURE_NAME = @featureName)
                BEGIN
                    INSERT INTO FEATURE_LIST (MODULE, FEATURE_NAME) VALUES ((SELECT ID FROM AUTOMATED_MODULES where MODULE_NAME = @module), @featureName); SELECT SCOPE_IDENTITY() AS ID; 
                END
            ELSE
                SELECT ID FROM FEATURE_LIST WHERE FEATURE_NAME = @featureName
         END
        `,
    UPDATE_SCENARIO_LIST = 
        `
        BEGIN
            IF NOT EXISTS (SELECT * FROM SCENARIO_LIST WHERE FEATURE_ID = @featureId AND SCENARIO_NAME = @scenarioName)
                BEGIN
                    INSERT INTO SCENARIO_LIST (FEATURE_ID, SCENARIO_NAME) VALUES (@featureId, @scenarioName)
                END
            ELSE
                SELECT ID as id FROM SCENARIO_LIST WHERE FEATURE_ID = @featureId AND SCENARIO_NAME = @scenarioName
        END
        `
    
    
}