import { removeSync, mkdirpSync } from 'fs-extra';
import { logFiglet } from '../utils/TextDesigns';

logFiglet('Starting test execution');

/**
 * Clean the report directory.
 */
export const cleanReportDirectory = () => {
    console.log(`\n=============================================================================`);
    console.log(`\nThe directory './report', which holds reports & screenshots is being cleaned.\n`);
    console.log(`=============================================================================\n`);
    removeSync('./report');
    mkdirpSync('./report/data');
};