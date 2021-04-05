import { AfterStep, Status } from '@cucumber/cucumber';
import { browser } from 'protractor';

/**
 * Runs after each step
 */
AfterStep(async function (scenario) {
    if (scenario.result.status === Status.FAILED) {
        // tslint:disable-next-line: no-invalid-this
        this.attach(await browser.takeScreenshot(), 'image/png');
    }
});