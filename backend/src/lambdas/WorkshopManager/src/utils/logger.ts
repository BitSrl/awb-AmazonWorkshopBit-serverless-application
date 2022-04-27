/**
 * @description Logger module is used for getting the console logs.
 * @class Logger
 */

import * as winston from 'winston';

// Ignore log messages if they have { private: true }
const ignorePrivate = winston.format((info) => {
    if (info.private) { return false; }
    return info;
});

let sessionLogger: winston.Logger | undefined = undefined;
export function createLogger(): winston.Logger {
    if( sessionLogger === undefined ) {
        sessionLogger = winston.createLogger({
            level: process.env['logLevel'] ?? 'debug',
            format: winston.format.combine(
                ignorePrivate(),
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [new winston.transports.Console()]
        });
        return sessionLogger;
    } else {
        return sessionLogger;
    }
}



export const logger = createLogger();