import { readFileSync } from "fs";
import * as path from 'path'

/**
 * Generate a list of CatalystOne modules in the project by reading .gitmodules file
 */
export class GenerateModuleList {

    /**
     * Parses .gitmodules file to generate a list of automated Catalystone modules
     * @returns Array of automated CatalystOne modules
     */
    public generateModuleList = ():string[] => {
        
        const moduleList: string[] = []
        const gitModuleFileLines = readFileSync(path.resolve(process.cwd(), '.gitmodules')).toString().split(/\r?\n/)

        gitModuleFileLines.forEach(line => {

            if(line.match(/path/) !== null && line.match(/pact/) === null) {
                moduleList.push(line.substring(line.lastIndexOf('/autobot_')+9, line.length))
            }
        })

        moduleList.push('application_common_interface')

        return moduleList
    } 
}