'use strict';

import mongoose from 'mongoose';
import County from '../models/county.model'
import Item from '../models/item.model';
import Criterion from '../models/criterion.model';

const EvaluationSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    dateEnd: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    durationMin: {
        type: String,
        required: true
    },
    county: {
        type: String,
        required: true
    },
    cityHallUrl: {
        type: String,
        required: true
    },
    transparencyPortalUrl: {
        type: String
    },
    criterions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Criterion'
    }]
}, {
    collection: 'Evaluation'
});

let EvaluationModel = mongoose.model('Evaluation', EvaluationSchema);

EvaluationModel.getAll = async () => {
    return (await EvaluationModel.find().populate({
        path: 'criterions',
        populate: {
            path: 'itens',
            model: 'Item'
        }
    }).exec());
}

EvaluationModel.findByCounty = async (countyName) => {
    return (await EvaluationModel.find({ county: countyName }).populate({
        path: 'criterions',
        populate: {
            path: 'itens',
            model: 'Item'
        }
    }).exec());
}

EvaluationModel.findLastByCounty = async (countyName) => {
    return (await EvaluationModel.findOne({ county: countyName }, {}, { sort: { 'created_at' : -1 } }).populate({
        path: 'criterions',
        populate: {
            path: 'itens',
            model: 'Item'
        }
    }).exec());
}



EvaluationModel.addEvaluation = async (evaluationToAdd, criterions) => {
    for (let criterion of criterions) {
        evaluationToAdd.criterions.push(criterion);
    }
    await evaluationToAdd.save();
    return evaluationToAdd;
}

EvaluationModel.addEvaluationWithOneCriterion = async (evaluationToAdd, criterion) => {
    evaluationToAdd.criterions.push(criterion);
    await evaluationToAdd.save();
    return evaluationToAdd;
}

EvaluationModel.removeEvaluation = (evaluationId) => {
    return EvaluationModel.remove({
        id: evaluationId
    });
}

export default EvaluationModel;