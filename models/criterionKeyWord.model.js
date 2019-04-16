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
        ref: 'ItemKeyWord'
    }],
    keywordSearch: [{
        type: String,
        required: true
    }],
}, {
        collection: 'CriterionKeyWord'
    });

let CriterionKeyWordModel = mongoose.model('CriterionKeyWord', CriterionKeyWordSchema);

CriterionKeyWordModel.getAll = async () => {
    return await CriterionKeyWordModel.find().populate('itens').exec();
}

CriterionKeyWordModel.findByName = async (nameCriterion) => {
    return await CriterionKeyWordModel.findOne({ name: nameCriterion }).populate('itens').exec();
}

CriterionKeyWordModel.addCriterionKeyWordModel = async (criterionKeyWordModelToAdd, identificationKeyWord) => {
    for (var key in identificationKeyWord) {
        try {
            const itemKeyWordSaved = await ItemKeyWord({
                name: key,
                identificationKeyWord: identificationKeyWord[key]
            }).save();

            criterionKeyWordModelToAdd.itens.push(itemKeyWordSaved);
        } catch (err) {

        }

    }
    await criterionKeyWordModelToAdd.save();
}

CriterionKeyWordModel.removeCriterionKeyWordModel = async (criterionKeyWordId) => {
    return await CriterionKeyWordModel.remove({
        id: criterionKeyWordId
    });
}


export default CriterionKeyWordModel;