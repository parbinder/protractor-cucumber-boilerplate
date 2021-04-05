import { SuperCalculatorHome, Operations } from '../../pages/calculator.page';

export const performCalculation = (term1: number, term2: number, operation: string) => {
    switch (operation) {
        case 'Addition': {
          return new SuperCalculatorHome().performCalculation(term1, term2, Operations.ADDITION); 
          break;       
        }
        case 'Subtraction': {
          return new SuperCalculatorHome().performCalculation(term1, term2, Operations.SUBTRACTION);
          break;       
        }
        case 'Multiplication': {
          return new SuperCalculatorHome().performCalculation(term1, term2, Operations.MULTIPLICATION);
          break;       
        }
        case 'Modulo': {
          return new SuperCalculatorHome().performCalculation(term1, term2, Operations.MODULO);
          break;       
        }
        case 'Division': {
          return new SuperCalculatorHome().performCalculation(term1, term2, Operations.DIVISION);
          break;       
        }
        default: {
          throw new Error(`Unknown operation - ${operation}\n Please select a valid operation.`);
        }
      }
};