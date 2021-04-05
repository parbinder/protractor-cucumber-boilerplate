/**
 * Blueprint to manage valid properties for cucumber options. 
 */
interface CucumberOptions { 
    require: Array<string>;
    format: string;
}

/**
 * Cucumber configuration options to include required modules and specify JSON report file path.
 */
export const cucumberOpts: CucumberOptions = {
    require:  [
        './steps/definitions/**/*.steps.ts',
        './hooks/*.ts',
        './pages/*.ts',
        './cucumber/*.ts',
        'ts:ts-node/register' 
    ],
    format: 'json:report/data/results.json'
};