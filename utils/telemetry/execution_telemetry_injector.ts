import { ITestCaseHookParameter, Status } from "@cucumber/cucumber"
import Request from "request-promise"
import * as os from "os"
import { ExecutionGrouper } from "./execution_group_mapper"

export class ExecutionTelemetryInjector {
  scenario: ITestCaseHookParameter
  scenarioName: string
  exceptionMessage: string | undefined
  isExceptionEncountered: boolean
  hostname: string
  static scenarioRetryAttemptRecord: Map<string, number> = new Map()
  TELEMETRY_SERVER_URL = 'http://52.140.35.185:8099'

  /**
   * Injects remote execution stats for scenarios to automation telemetry database
   * @param scenario Cucumber `HookScenarioResult` object that tracks and maintains the scenario execution 
   * @param currentURL Helps to identify the hostname to be logged in the system
   */
  constructor(scenario: ITestCaseHookParameter, currentURL: string) {
    this.scenario = scenario
    this.isExceptionEncountered = false
    this.scenarioName = this.getScenarioName()
    this.setExceptionEncounteredStatus()
    this.exceptionMessage = this.getScenarioFailureCause()
    this.hostname = this.getHostName(currentURL)
    this.pushExecutionTelemetryData()
  }

  /**
   * Converts the boolean status for any exception encountered to binary output to be saved as BIT in database
   * @returns Binary output for whether an exception was encountered during respective scenarion execution 
   */
  getExceptionStatus = () => {
    if (this.isExceptionEncountered === true) { return 1 }
    else { return 0 }
  }

  /**
   * Sets Exception status for the running scenario
   * @returns Concludes and returns the running status for a scenario
   */
  setExceptionEncounteredStatus = () => {
    if (this.scenario.result?.status === Status.FAILED) {
      this.isExceptionEncountered = true

    }
  }


  /**
   * Get scenario name from cucumber's `HookScenarioResult` object
   * @returns Name of the currently running scnenario
   */
  getScenarioName = () => { return this.scenario.pickle.name.trim().replace("'", "''") }

  /**
   * In progress - Will conclude a safer way to indentify retries without introduing too much overhead
   */
  setRetryAttemptIndex = () => {

    if (ExecutionTelemetryInjector.scenarioRetryAttemptRecord.has(this.scenario.pickle.name)) {
      ExecutionTelemetryInjector.scenarioRetryAttemptRecord.set(this.scenario.pickle.name, Number(ExecutionTelemetryInjector.scenarioRetryAttemptRecord.get(this.scenario.pickle.name)))
    }
    else {
      ExecutionTelemetryInjector.scenarioRetryAttemptRecord.set(this.scenario.pickle.name, 0)
    }
  }

  /**
   * Reads exception message from `HookScenarioResult` object
   * @returns Message in the encountered exception
   */
  getScenarioFailureCause = () => {
    if (this.isExceptionEncountered) {
      return this.scenario.result?.message?.toString().trim().replace("'", "''")
    } else {
      return undefined
    }
  }

  /**
   * Generates a request to send telemetry of the execution status
   * @param scenarioName Name of the executed scneario
   * @param executionStatus Execution result returned by cucumber
   * @param hostName Name of the application instance where automation is running
   * @returns Execution id generated on the database by the telemetry server
   */
  pushExecutionDataToTelemetryServer = async (scenarioName: string, executionStatus: any, hostName: string) => {

    const requestOptions = {
      method: 'POST',
      uri: `${this.TELEMETRY_SERVER_URL}/api/updateExecutionDetails`,
      headers: { "content-type": "application/json" },
      body: (
        {
          scenarioName: scenarioName,
          executionStatus: executionStatus,
          hostName: hostName,
          execptionStatusBit: this.getExceptionStatus(),
          hostMachineName: os.hostname(),
          hostMachineUserName: os.userInfo().username,
          executionGroupId: ExecutionGrouper.EXECUTION_ID
        }),
      resolveWithFullResponse: true,
      json: true,
    }

    try {
      const rawResponse = await Request(requestOptions)

      return (rawResponse.body.id)
    }
    catch (e: any) {
      throw new Error(e.toString())
    }
  }

  /**
   * 
   * @param executionId Id returned by the telemetry server generated while request for pushing execution stats
   * @param exceptionType High level exception classs
   * @param exceptionCategory Basically represents exception message as of now
   * @returns Id generated on the server for the requested entry
   */
  pushExceptionDataToTelemetryServer = async (executionId: number, exceptionType: string | undefined, exceptionCategory: string | undefined) => {

    const requestOptions2 = {
      method: 'POST',
      uri: `${this.TELEMETRY_SERVER_URL}/api/updateExceptionDetails`,
      headers: { "content-type": "application/json" },
      body: (
        {
          executionId: executionId,
          exceptionType: exceptionType,
          exceptionCategory: exceptionCategory,
        }),
      resolveWithFullResponse: true,
      json: true,
    }

    try {

      if (executionId !== undefined && exceptionType !== undefined) {
        const rawResponse = await Request(requestOptions2)

        return (rawResponse.body.id)
      }

      else { throw new Error() }
    }
    catch (e: any) {
      throw new Error(e.toString())
    }
  }


  pushExecutionTelemetryData = async () => {

    const result = await this.pushExecutionDataToTelemetryServer(this.getScenarioName(), this.scenario.result?.status, this.hostname)

    if (this.isExceptionEncountered === true) { this.pushExceptionDataToTelemetryServer(Number(result), this.scenario.result?.message?.toString().replace(/'/g, '"'), this.exceptionMessage?.toString().replace(/'/g, '"')) }
  }

  /**
   * 
   * @param currentURL Conclude the application instance under test
   * @returns HOstname of the AUT
   */
  getHostName = (currentURL: string): string => {
    if (currentURL.includes("localhost")) { return "localhost" }
    else { return currentURL.split("/")[2] }
  }
}