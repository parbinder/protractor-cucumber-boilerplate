import { FeatureScenarioStatCalulator } from "./feature_scenario_stat_counter"
import { GenerateModuleList } from "./module_list_creator"
import { TelemetryDAO } from "./telemetry_dao"

/**
 * Injects telemetry data for automation to telemetry database
 */
export class FeatureScenarioStatsTelemetryInjector {

    telemetryDAO = new TelemetryDAO()
    moduleList: string[]
    featureScenarioCountDetails: any
    /**
     * Injects telemetry data for automation to telemetry database
     */
    constructor() {
        this.moduleList = new GenerateModuleList().generateModuleList()
        this.featureScenarioCountDetails = new FeatureScenarioStatCalulator(this.moduleList).getFeatureScenarioDetailStats()
        this.injectAutomationStats()
    }


    private injectAutomatedModuleList = async () => {
        await this.telemetryDAO.updateAutomatedModuleList(this.moduleList)
    } 
    /**
     * Injects feature scenario stats to telemetry database
     */
    private injectFeatureScenarioStats = async() => {
        await this.telemetryDAO.updateFeatureScenarioStats(this.featureScenarioCountDetails)
    }

    public injectAutomationStats = async () => {
        await this.injectAutomatedModuleList()
        await this.injectFeatureScenarioStats()
    }

}


new FeatureScenarioStatsTelemetryInjector()