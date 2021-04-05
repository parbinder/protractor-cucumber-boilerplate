import { cleanReportDirectory } from '../hooks/BeforeLaunch';
import { generateHtmlReport } from '../hooks/OnComplete';
import { Config } from 'protractor';
import { cucumberOpts } from './Cucumber.conf';

export const config: Config = {
    /**
     * Connect directly to the browser drivers. Only Chrome and Firefox are supported for direct connect.
     */
    directConnect: true,

    /**
     *  This may be one of: jasmine, mocha or custom. Default value is 'jasmine'.
     */
    framework: 'custom',
    /**
     * For custom framework , a path to framework module is required.
     */
    frameworkPath: require.resolve('protractor-cucumber-framework'), 

    /**
     * Includes browser choice and its capabilities. Browser specific options can also be specified here.
     */
    capabilities: { 
        browserName: 'chrome',
    },
    
    /**
     * Pattern to include the tests. For cucucmber, feature files are included.
     */
    specs: [
        './features/**/*.feature'
    ],

    /**
     * Feature files to be included in the test execution.
     */
    suites: ['./features/**/*.feature'],

    /**
     * Logs exceptions as warnings and continues test execution.
     */
    ignoreUncaughtExceptions: true,

    /**
     * A base URL for your application under test.
     */
    baseUrl: 'http://juliemr.github.io/protractor-demo/',

    /**
     * Timeout for each script execution. This time interval should exceed total time taken by sleeps and implicit waits.
     */
    allScriptsTimeout: 10000,
    
    /**
     * Takes a callback function. Runs once before the specs execution.
     */
    onPrepare: () => {},

    /**
     * Takes a callback function. Runs once after the specs execution before shutting down protractor.
     */
    onComplete: generateHtmlReport,

    /**
     * Takes a callback function. Runs once after specs execution after shutting down protractor.It will be called once for each capability.
     */
    onCleanUp: () => {},

    /**
     * Takes a callback function. Runs once after the configurations have been read (runs before onPrepare).
     */
    beforeLaunch: cleanReportDirectory,

    /**
     * Takes a callback function. Runs once after executing all specs and  WebDriver instance has been shut down (runs before onCleanUp).   
     */
    afterLaunch: () => {}, 
};

// tslint:disable-next-line: no-string-literal
config['cucumberOpts'] = cucumberOpts;