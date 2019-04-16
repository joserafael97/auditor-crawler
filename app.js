'use strict';
import CriterionKeyWord from './models/criterionKeyWord.model'
import connectToDb from './db/connect'
import mongoose from 'mongoose';


const conexion = connectToDb();

CriterionKeyWord.findByName('Despesa Extra Orçamentária').then(function(result){
    console.log(result)
    mongoose.connection.close()
});