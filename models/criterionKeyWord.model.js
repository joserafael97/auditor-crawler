'use strict';

import mongoose from 'mongoose';
import ItemKeyWord from '../models/itemKeyWord.model'

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

CriterionKeyWordModel.addCriterionKeyWordModel = async (criterionKeyWordModelToAdd, identificationKeyWord) => {
    for (var key in identificationKeyWord) {
        try {
            const itemKeyWordSaved = await  ItemKeyWord({
                name: key,
                identificationKeyWord: identificationKeyWord[key]
            }).save();

            criterionKeyWordModelToAdd.itens.push(itemKeyWordSaved);
        } catch (err) {
            
        }

    }
    await criterionKeyWordModelToAdd.save();
}

CriterionKeyWordModel.removeCriterionKeyWordModel = (criterionKeyWordId) => {
    return CriterionKeyWordModel.remove({
        id: criterionKeyWordId
    });
}


export default CriterionKeyWordModel;