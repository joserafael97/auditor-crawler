
import path from "path";
import CliParamUtil from "../../utils/cliParamUtil";

let config = {};

config.logFileDir = path.join(__dirname, '../../log');
config.logFileName = 'app.log';
config.dbHost = process.env.dbHost || 'localhost';
config.dbPort = process.env.dbPort || '27017';


const allItens = process.argv.slice(4)[0] !== undefined && CliParamUtil.allItensParamExtract(process.argv.slice(4)[0]) === "true" ? true : 
        process.argv.slice(2)[0] !== undefined && CliParamUtil.allItensParamExtract(process.argv.slice(2)[0]) === "true" ? true : false;

console.log("allItens: ", allItens)

if (allItens !== undefined && !allItens) {
    config.dbName = process.env.dbName || 'auditor-crawler-exp02';
    // config.dbName = process.env.dbName || 'auditor-crawler-test-lessitens';

    // config.dbName = process.env.dbName || 'auditor-crawler-test';


} else {
    // config.dbName = process.env.dbName || 'auditor-crawler-test-allitens';
    // config.dbName = process.env.dbName || 'auditor-crawler-exp01';
    config.dbName = process.env.dbName || 'auditor-crawler-exp01-expandit';

}

config.serverPort = process.env.serverPort || 3000;

export default config;
