import { configure, getLogger } from 'log4js';

export class Logger {

    static getLogger = () => {
        configure('./log4js.json');
        let log = getLogger('file');
        return log;
    }
} 