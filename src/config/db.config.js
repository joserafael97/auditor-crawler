
import { connection, Promise as _Promise, connect as _connect, set } from 'mongoose';

const environment = process.env.NODE_ENV;
const db = connection;

function connect () {
    const mongoUrl = environment === 'development' ? 'mongodb://localhost/manager' : 'mongodb://localhost/test_simple'

    _Promise = Promise;  
    _connect(mongoUrl, { useNewUrlParser: true });
    set('useCreateIndex', true);

    db.on('error', console.error.bind(console, 'conection error:'));
    db.once('open', () => {
        console.log('db connection ok');
    });
}

export default connect;