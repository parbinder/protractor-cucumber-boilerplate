import { UUIDGenerator } from "../../core/misc_utils/uuid_generator";

/**
 * Intializes a UUID to be used for grouping executions for telemetry
 */
export class ExecutionGrouper {

    static EXECUTION_ID:any
    initializeExecutionGroupID = () => { ExecutionGrouper.EXECUTION_ID = new UUIDGenerator().generateUUID()}
}