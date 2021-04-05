import { Given, When, Then } from '@cucumber/cucumber';
import { browser } from 'protractor';
import { expect } from 'chai';
import { Logger } from '../../utils/Logger'; 
import { performCalculation } from '../functions/Calculator.sf';

let log =  Logger.getLogger();
let actualResult: number;

Given('User is on the Super calculator application web page.', async () => {
    await browser.get('http://juliemr.github.io/protractor-demo/');
    log.debug(`Page title - ${await browser.getTitle()}`);
});

When('User input values as {float} and {float}, selects {string} operation and clicks Go button.', 
  async (term1: number, term2: number, operation: string) => {   
    
    log.debug(`Initiated calculation for operation - ${operation}`); 
    actualResult = await performCalculation(term1, term2, operation);
    log.debug('Successfully extracted result from the browser');

});

Then('The result should be {float}', async (expectedResult: number) => {
    try {
        expect(actualResult).to.deep.equal(expectedResult);
        log.debug(`Successfully asserted results - Expected and actual results match`);
    } catch (e) {
        log.error(`Error while asserting results - Expected '${actualResult} (${typeof actualResult})' to be equal to '${expectedResult} (${typeof expectedResult})'`);
        throw new Error(e);
    }

});