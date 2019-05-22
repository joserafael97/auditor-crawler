'use strict';

import mongoose from 'mongoose';
import Criterion from '../models/criterion.model'

const EvaluationSchema = mongoose.Schema({
    date: { type: Date, required: true },
    county: { type: String, required: true },
    cityHallUrl: { type: String, required: true },
    transparencyPortalUrl: { type: String },
    criterions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Criterion' }]
}, { collection: 'Evaluation' });

let EvaluationModel = mongoose.model('Evaluation', EvaluationSchema);

EvaluationModel.getAll = () => {
    return EvaluationModel.find({});
}

EvaluationModel.addEvaluation = async (evaluationToAdd, criterions) => {
    for (let criterion of criterions) {
        evaluationToAdd.criterions.push(criterion);
    }
    await evaluationToAdd.save();
    return evaluationToAdd;
}

EvaluationModel.removeEvaluation = (evaluationId) => {
    return EvaluationModel.remove({ id: evaluationId });
}

export default EvaluationModel;


