import express from 'express';
import evaluationRoutes from './routes/evaluation.route'
import connectToDb from '../db/connect'
import bodyParser  from 'body-parser'

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

connectToDb();

app.all("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use('/api/v1/evaluation', evaluationRoutes);


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});