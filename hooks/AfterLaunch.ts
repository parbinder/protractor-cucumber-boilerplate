import { logFiglet } from '../utils/TextDesigns';
import { AfterAll } from '@cucumber/cucumber';

/**
 * Executes onces all features have been executed.
 */
AfterAll(() => {
    console.log('\n');
    logFiglet('Test execution finished');
});