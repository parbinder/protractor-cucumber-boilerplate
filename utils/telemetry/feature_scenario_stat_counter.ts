import { FeatureFileListGenerator } from './feature_list_generator'
import { readFileSync } from "fs"
import { TelemetryDAO } from './telemetry_dao'

/**
 * Calculates the number of automated
 */
export class FeatureScenarioStatCalulator {
    
    automatedFeaturePathList: string[]
    moduleList: string[]
    featureScenarioCountDetails: any = {}
    totalFeatureCount = 0
    totalScenarioCount = 0
    static tagList: string[][] = []
    
    /**
     * Calculates the number of automated
     */
    constructor(moduleList:string[]) {
        this.moduleList = moduleList
        this.featureScenarioCountDetails = this.createFeatureScenarioDetailsObject()
        this.automatedFeaturePathList = new FeatureFileListGenerator().generateFeaturesFilesInProjectPathList('./')
    }
    
    /**
     * Creates a list of features and scenarions in the  project categorized by different modules
     * @returns An object containing the count and the names of the features and scenarios 
     */
    public getFeatureScenarioDetailStats() {
        this.populateFeatureScenarioDetails()
        return this.featureScenarioCountDetails
    }

    /**
     * Reads through feature file content to identify usage of scenario keyword occurances and return a list of scenario descriptions/names
     * @param featureName 
     * @param featureFileContent 
     * @returns Object of feature names and names/descriptions of contained scenarios
     */
    private getScenarioListFromFeatureFileContent(featureName: string, featureFileContent: string): any {
        const scenarioList: string[] = []
        const featureFileTextLines: string[] = featureFileContent.split(/\r?\n/) 

        // featureFileTextLines.forEach(featureFileTextLine => {

        //     if(featureFileTextLine.match(/Scenario:/g)!== null && !featureFileTextLine.trim().startsWith('#')) {
        //         scenarioList.push(featureFileTextLine.replace('Scenario:', '').trim().replace("'", "''"))
                
        //         if(featureFileTextLine.match(/Scenario outline:/g)!== null) {
        //             scenarioList.push(featureFileTextLine.replace('Scenario outline:', '').trim().replace("'", "''"))
        //         }
        //     }
        // })

        for(let i = 0; i < featureFileTextLines.length; i++) {
            
            const tagData = []

            if(!featureFileTextLines[i].trim().startsWith('#') && featureFileTextLines[i].match(/@/g) !== null && featureFileTextLines[i+1].match(/Scenario:/g) !== null) {
               
                   const tags = (featureFileTextLines[i].trim().replace(',', '').replace('\r', '').replace('\n', '').split('@').join(',').trim())
                   const scenarioTitle = featureFileTextLines[i+1].replace('Scenario:', '').trim().replace("'", "''")

                   if(tags.length > 0) {
                    tagData.push(tags)
                    tagData.push(scenarioTitle)
                   }
            }

            if(tagData.length > 0) {
                FeatureScenarioStatCalulator.tagList.push(tagData)    
            }
        }
        
        featureFileTextLines.forEach(featureFileTextLine => {

            if(featureFileTextLine.match(/Scenario:/g)!== null && !featureFileTextLine.trim().startsWith('#')) {
                scenarioList.push(featureFileTextLine.replace('Scenario:', '').trim().replace("'", "''"))
                
                if(featureFileTextLine.match(/Scenario outline:/g)!== null) {
                    scenarioList.push(featureFileTextLine.replace('Scenario outline:', '').trim().replace("'", "''"))
                }
            }
        })

        return {feature: featureName, scenariosList: scenarioList }
    }

    /**
     * Reads through the feature file content to identify occurances of feature keyword and gets feature name 
     * @param featureFileContent Content of the feature file as a string
     * @returns Name of the feature specified in the feature file
     */
    private getFeatureNameFromFeatureFile(featureFileContent: string): string {

        let featureName = ''
        featureFileContent.split(/\r?\n/).forEach(featureFileTextLine => {
            if(featureFileTextLine.trim().includes('Feature:')) {
                
                featureName = featureFileTextLine.substring(featureFileTextLine.lastIndexOf('Feature:') + 8, featureFileTextLine.length);
            }
        })

        return featureName
    }

    /**
     * Reads through the feature file content to identify occurances of feature keyword and gets feature name 
     * @param featureFileContent Content of the feature file as a string
     * @returns Name of the feature specified in the feature file
     */
    private getScenarioCountFromFeatureFile(featureFileContent: string): number {
        return (featureFileContent.match(/Scenario:/g) || featureFileContent.match(/Scenario outline:/g) || []).length
    }
    
    /**
     * Extracts module name from the feature file path
     * @param featurePath Absolute path of the feature file
     * @returns Name of the module feature belongs to
     */
    private getModuleNameFromFeatureFilePath(featurePath: string): string {
        if(featurePath.lastIndexOf('\\autobot_') !== -1) {
            const truncatedPathString = featurePath.substring(featurePath.lastIndexOf('\\autobot_') + 9)
            return truncatedPathString.substring(0, truncatedPathString.indexOf('\\'))
        }
        else { return 'application_common_interface' }
    }

    /**
     * Creates a dynamic object to store feature and scenario names categorized by modules
     * @returns Updated object properties for featureScenarioCountDetails
     */
    private createFeatureScenarioDetailsObject = (): any => {
        this.moduleList.forEach(module => {       
            const initialFeatureScenarioCountDetails = {
                featureCount: 0,
                scenarioCount: 0,
                scenarioList: [],
            }
            this.featureScenarioCountDetails[module] = initialFeatureScenarioCountDetails
        })
        return this.featureScenarioCountDetails;
    }

    /**
     * Calls different internal functions to read feature scenario stats for different modules in the project and populates data to a single persitance object
     */
    private populateFeatureScenarioDetails = async () => {
        
        this.automatedFeaturePathList.forEach(featurePath => {
            let scenarioListPerFeature: string[]

            if(featurePath.indexOf("pact") > -1 || featurePath.indexOf("pact_playground") > -1) {
                return
            }

            const featureFileContent = readFileSync(featurePath).toString()

            const moduleName = this.getModuleNameFromFeatureFilePath(featurePath)
            const featureName = this.getFeatureNameFromFeatureFile(featureFileContent)
            const scenarioCount = this.getScenarioCountFromFeatureFile(featureFileContent)

            this.totalScenarioCount += scenarioCount
            
            if(featureName !== null && featureName !== undefined && featureName !== '' && (featureFileContent.indexOf('Scenario') >=0)) {
                scenarioListPerFeature = this.getScenarioListFromFeatureFileContent(featureName, featureFileContent)
                
                this.totalFeatureCount += 1

                this.featureScenarioCountDetails[moduleName].featureCount = this.featureScenarioCountDetails[moduleName].featureCount + 1
                this.featureScenarioCountDetails[moduleName].scenarioCount = this.featureScenarioCountDetails[moduleName].scenarioCount + scenarioCount
                this.featureScenarioCountDetails[moduleName].scenarioList.push(scenarioListPerFeature)
            }

        })
    await new TelemetryDAO().insertTotalFeatureScenarioCountStats()
    await new TelemetryDAO().pushTagDetails()
    } 
}