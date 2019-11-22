
import path from "path";
import CliParamUtil from "../../utils/cliParamUtil";

let config = {};

config.logFileDir = path.join(__dirname, '../../log');
config.logFileName = 'app.log';
config.dbHost = process.env.dbHost || 'localhost';
config.dbPort = process.env.dbPort || '27017';

const allItens = CliParamUtil.allItensParamExtract(process.argv.slice(4)[0]) === "true" ? true : false;

if (allItens) {
    config.dbName = process.env.dbName || 'auditor-crawler-test';
    // config.dbName = process.env.dbName || 'auditor-crawler-exp02-notitens';
} else {
    // config.dbName = process.env.dbName || 'auditor-crawler-test';
    config.dbName = process.env.dbName || 'auditor-crawler-exp01-expandit';
}

config.serverPort = process.env.serverPort || 3000;

export default config;
