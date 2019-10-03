
import Mongoose from 'mongoose';
import logger from '../core/logger/app-logger'
import config from '../core/config/config.dev'

Mongoose.Promise = global.Promise;

const connectToDb = async () => {
    let dbHost = config.dbHost;
    let dbPort = config.dbPort;
    let dbName = config.dbName;
    try {
        Mongoose.set('useNewUrlParser', true);
        Mongoose.set('useFindAndModify', false);
        Mongoose.set('useCreateIndex', true);
        Mongoose.set('useUnifiedTopology', true);

        Mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`);
        logger.info('Connected to mongo!!!');

        return Mongoose;
    }
    catch (err) {
        logger.error('Could not connect to MongoDB');
    }
}

export default connectToDb;