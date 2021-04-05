import { element, ElementFinder, by } from 'protractor';
import { Logger } from '../utils/Logger';

let log = Logger.getLogger();

/**
 * Collection of possible arithmetic operations on the page
 */
export enum Operations { 
    ADDITION = 'ADDITION', 
    SUBTRACTION = 'SUBTRACTION', 
    MULTIPLICATION = 'MULTIPLICATION', 
    DIVISION = 'DIVISION', 
    MODULO = 'MODULO'}

/**
 * Page Object for Calculator application home page 
 */
export class SuperCalculatorHome {

    /**
     * Input box for first term 
     */   
    firstInput: ElementFinder;

    /**
     * Input box for second term 
     */   
    secondInput: ElementFinder;

    /**
     * Go button to perform calculation
     */
    goButton: ElementFinder;

    /**
     * Result rendered after calculation is performed
     */
    resultText: ElementFinder;

    /**
     * Dropdown to select the arithmetric operation
     */
    operatorDropdown: ElementFinder;

    /**
     * Arithmetric operation to be selected. 
     * This will be intialized in perform calucation function based on operator provided.
     */
    operatorDropdownOption: ElementFinder | undefined; //  

    /**
     * Initializing page elements on invocation
     */
    constructor() {
        this.firstInput = element(by.model('first'));
        this.secondInput = element(by.model('second'));
        this.goButton = element(by.css('#gobutton'));
        this.resultText = element(by.xpath('//h2[@class="ng-binding"]'));
        this.operatorDropdown = element(by.model('operator'));
    }

    /**
     * Perform the calculation process. 
     * This functions inputs the terms, selects arithmetic operation, executes the calculation and returns result. 
     * @param term1 `number` First input for the calculation.
     * @param term2 `number` Second input for the calculation.
     * @param operation `Operations` Arithmetic operation to be perfomed.
     * @returns `Promise<number>` Result of the calculation performed. 
     */
    performCalculation = async (term1: number, term2: number, operation: Operations): Promise<number> => {
        
        try {
            /**
             * Initializing operator dropdown selection operation based on operation passed as parameter to the function.
             */
            this.operatorDropdownOption = element(by.xpath(`//select[@ng-model="operator"]//option[@value="${operation.toString()}"]`));
        
            await this.firstInput.sendKeys(term1);
            log.debug(`Entered first input as - ${term1}`);
            
            await this.secondInput.sendKeys(term2);
            log.debug(`Entered second input as - ${term2}`);
            
            await this.operatorDropdown.click();
            log.debug(`Clicked on operator drop down successfully`);
            
            await this.operatorDropdownOption.click();
            log.debug(`Selected ${operation.toString()} successfully`);
            
            await this.goButton.click();
            log.debug(`Clicked on Go button successfully`);
        
            return +await  this.resultText.getText();

        } catch (e) {
            log.error(`Failed to perform  calculation.\nCause - ${e}`);
            throw new Error(e);
        }
    }
}