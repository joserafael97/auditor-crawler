import express from 'express';
import Evaluation from './models/evaluation.model'
import connectToDb from './db/connect'

const app = express();
connectToDb();

app.get('/api/v1/evaluation/', (req, res) => {
    Evaluation.getAll().then((evaluations) => {
        if (!evaluations) {
            return res.status(404).send({
                'message': 'evaluations not found'
            });
        }
        return res.status(200).send(evaluations);
    });

});

app.get('/api/v1/evaluation/:county/last', (req, res) => {
    Evaluation.findLastByCounty(req.params.county).then((evaluations) => {
        if (!evaluations) {
            return res.status(404).send({
                'message': 'evaluations not found'
            });
        }
        return res.status(200).send(evaluations);
    });

});

app.get('/api/v1/evaluation/:county', (req, res) => {
    Evaluation.findByCounty(req.params.county).then((evaluations) => {
        if (!evaluations) {
            return res.status(404).send({
                'message': 'evaluations not found'
            });
        }
        return res.status(200).send(evaluations);
    });

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});