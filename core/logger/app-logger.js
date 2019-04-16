
import * as winston from 'winston'
import config from '../config/config.dev'
import * as fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file'

const dir = config.logFileDir;

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

let logger = winston.createLogger({
    level: 'info',
    transports: [
        new (winston.transports.Console)({
            colorize: true,
        }),
        
        new DailyRotateFile({
            filename: config.logFileName,
            dirname: config.logFileDir,
            maxsize: 20971520, //20MB
            maxFiles: 25,
            datePattern: '.dd-MM-yyyy'
        })
    ]
});

export default logger;