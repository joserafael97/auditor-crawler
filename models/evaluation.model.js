'use strict';

import mongoose from 'mongoose';

const EvaluationSchema = mongoose.Schema({
    date: {type: Date, required: true}, 
    county: {type: String, required: true}, 
    cityHallUrl: {type: String, required: true}, 
    transparencyPortalUrl: {type: String}, 
    criterions: [{type: Schema.Types.ObjectId, ref: 'Criterion' }]
}, {collection : 'Evaluation'});

let EvaluationModel = mongoose.model('Evaluation', EvaluationSchema);

EvaluationModel.getAll = () => {
    return EvaluationModel.find({});
}

EvaluationModel.addEvaluation = (evaluationToAdd) => {
    return evaluationToAdd.save();
}

EvaluationModel.removeEvaluation = (evaluationId) => {
    return EvaluationModel.remove({id: evaluationId});
}

export default EvaluationModel;


