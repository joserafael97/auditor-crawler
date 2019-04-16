'use strict';

import mongoose from 'mongoose';

const CriterionSchema = mongoose.Schema({
    name: {type: String, required: true}, 
    itens: [{type: Schema.Types.ObjectId, ref: 'Item' }], 
    evaluation: {type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' }
}, {collection : 'Criterion'});

let CriterionModel = mongoose.model('Criterion', CriterionSchema);

CriterionModel.getAll = () => {
    return CriterionModel.find({});
}

CriterionModel.addCriterion = (criterionToAdd) => {
    return criterionToAdd.save();
}

CriterionModel.removeCriterion = (criterionId) => {
    return CriterionModel.remove({id: criterionId});
}

export default CriterionModel;