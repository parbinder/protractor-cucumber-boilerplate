import { readdirSync, statSync } from 'fs'
import path from 'path'

/**
 * Creates a list of feature file paths by recursively reading the project directories 
 */
export class FeatureFileListGenerator {

    /**
     * Creates a list of absolute path of all feature files contained in the given directory 
     * @param initialDirectoryPath Initial file path to start feature read recursion 
     */
    public generateFeaturesFilesInProjectPathList = (initialDirectoryPath: string) => {
        const tempRecursionList: string[] = []
        const completeFeatureList = this.createFeatureFilePathList(initialDirectoryPath, tempRecursionList)
        const finalFeatureList: string[] = []

        completeFeatureList.forEach(featurePath => {
            if (!featurePath.includes('e2e') && !(featurePath.includes('\\sit\\') || featurePath.includes('/sit/')) && !(featurePath.includes('\\functional_tests\\') || featurePath.includes('/functional_tests/'))) {
                finalFeatureList.push(featurePath)
            }
        })
        return finalFeatureList

    }

    public generateFeaturesFilesPathListForSIT = (initialDirectoryPath: string) => 
    {
        const tempRecursionList: string[] = []
        const completeFeatureList = this.createFeatureFilePathList(initialDirectoryPath, tempRecursionList) 
        const sitFeatureList: string[] = [] 
         
        completeFeatureList.forEach(featurePath => { 
            
            if (featurePath.includes('\\sit\\') || featurePath.includes('/sit/')) {
                 sitFeatureList.push(featurePath)
            } 
        })  
        return sitFeatureList 
    }

    public generateFeaturesFilesPathListForE2E = (initialDirectoryPath: string) => {

        const tempRecursionList: string[] = []
        const completeFeatureList = this.createFeatureFilePathList(initialDirectoryPath, tempRecursionList)
        const e2eFeatureList: string[] = []

        completeFeatureList.forEach(featurePath => {
            if (featurePath.includes('e2e')) {
                e2eFeatureList.push(featurePath)
            }
        })
        return e2eFeatureList
    }

    /**
     * Internal function to recursively read files in directories and sub-directories to identify feature files and return a list of absolute paths of feature files
     */
    private createFeatureFilePathList = (initialDirectoryPath: string, tempRecursionList: string[]): string[] => {

        const filePathInCurrentDirectoryList = readdirSync(initialDirectoryPath);
        tempRecursionList = tempRecursionList || [];

        filePathInCurrentDirectoryList.forEach((filePath: string) => {
            if (statSync(`${initialDirectoryPath}/${filePath}`).isDirectory()) {
                tempRecursionList = this.createFeatureFilePathList(initialDirectoryPath + "/" + filePath, tempRecursionList);
            }
            else {
                if (filePath.indexOf(".feature") > -1 && initialDirectoryPath.indexOf("node_modules") === -1) {
                    tempRecursionList.push(path.join(process.cwd(), `${initialDirectoryPath}/${filePath}`));
                }
            }
        });

        return tempRecursionList;
    }

    public createChromeDriverPath = (initialDirectoryPath: string, tempRecursionList: string[]): string[] => {

        const filePathInCurrentDirectoryList = readdirSync(initialDirectoryPath);
        tempRecursionList = tempRecursionList || [];

        filePathInCurrentDirectoryList.forEach((filePath: string) => {
            if (statSync(`${initialDirectoryPath}/${filePath}`).isDirectory()) {
                tempRecursionList = this.createChromeDriverPath(initialDirectoryPath + "/" + filePath, tempRecursionList);
            }
            else {
                
                if (filePath.indexOf('LICENSE') == -1 && filePath.indexOf("chromedriver") > -1 && initialDirectoryPath.indexOf("node_modules") === -1) {
                    tempRecursionList.push(path.join(process.cwd(), `${initialDirectoryPath}/${filePath}`));
                }
            }
        });

        return tempRecursionList;
    }
}
