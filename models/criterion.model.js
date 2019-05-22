'use strict';

import mongoose from 'mongoose';

const CriterionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    itens: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    evaluation: { type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' }
}, { collection: 'Criterion' });

let CriterionModel = mongoose.model('Criterion', CriterionSchema);

CriterionModel.getAll = () => {
    return CriterionModel.find({});
}

CriterionModel.addCriterion = async (criterionToAdd, itens) => {
    for (const item of itens) {
        try {
            await item.save();
            console.log(item)
            criterionToAdd.itens.push(item);
        } catch (err) {
        }

    }
    await criterionToAdd.save();
    return criterionToAdd;
}

CriterionModel.removeCriterion = (criterionId) => {
    return CriterionModel.remove({ id: criterionId });
}

export default CriterionModel;