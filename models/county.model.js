'use strict';

import mongoose from 'mongoose';

const Countychema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    codSepro: {
        type: String,
        required: true,
    },
    cityHallUrl: {
        type: String,
        required: true
    },
    transparencyPortalUrl: {
        type: String,
        required: true
    },
    population: {
        type: Number,
    },
    empresas: [{
        type: String,
        required: true
    }],
    
});

let CountyModel = mongoose.model('County', Countychema);


CountyModel.getAll = async () => {
    return await CountyModel.find();
}

CountyModel.findByName = async (countyName) => {
    return await CountyModel.findOne({ name: countyName });
}


CountyModel.addCounty = async (countyKeyWordModelToAdd) => {
    return (await countyKeyWordModelToAdd.save());
}

export default CountyModel;