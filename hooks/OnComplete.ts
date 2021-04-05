import { generate, Options } from 'cucumber-html-reporter';
import { totalmem, hostname, version } from 'os';
import { browser } from 'protractor';

/**
 * Generates HTML report once all tests are executed.
 */
export const generateHtmlReport = async () => {

    const options: Options = {
        theme: 'bootstrap',
        ignoreBadJsonFile: true,
        jsonFile: 'report/data/results.json',
        output: 'report/cucumber_report.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: true,
        storeScreenshots: true,
        metadata: {
            'App Version': '0.3.2',
            'Test Environment': 'STAGING',
            // tslint:disable-next-line: no-string-literal
            'Browser': `Chrome  ${(await browser.getCapabilities()).get('version')}`,
            'Platform': version(),
            'Hostname': hostname(),
            'System RAM': (totalmem() / (1024 * 1024 * 1024)).toPrecision(2),
            'Execution mode': 'Remote'
        }
    };

    generate(options);

    console.log(`\n=============================================================================`);
    console.log(`\Test execution complete. Please Refer to html report for detailed information.\n`);
    console.log(`=============================================================================\n`);

    browser.quit();
};