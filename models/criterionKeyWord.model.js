'use strict';

import mongoose from 'mongoose';

const CriterionKeyWordSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    itens: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemKeyWords'
    }],
    keywordSearch: [{
        type: String,
        required: true
    }],
}, {
    collection: 'CriterionKeyWord'
});

let CriterionKeyWordModel = mongoose.model('CriterionKeyWord', CriterionKeyWordSchema);

CriterionKeyWordModel.getAll = () => {
    return CriterionKeyWordModel.find({});
}

CriterionKeyWordModel.addCriterionKeyWordModel = (criterionKeyWordModelToAdd) => {
    return criterionKeyWordModelToAdd.save();
}

CriterionKeyWordModel.removeCriterionKeyWordModel = (criterionKeyWordId) => {
    return CriterionKeyWordModel.remove({
        id: criterionKeyWordId
    });
}


export default CriterionKeyWordModel;