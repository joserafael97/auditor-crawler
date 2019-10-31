
import { GaussianNB } from 'ml-naivebayes';
import { MultinomialNB } from 'ml-naivebayes';

import { Matrix } from 'ml-matrix';
import csv from 'csv-parser';
import fs from 'fs';
import FeaturesConst from './consts/featuares';

let dataTrain = [];

fs.createReadStream('test.csv')
    .pipe(csv())
    .on('data', (data) => {
        data['result'] = data['result'] === 'component_relevant' ? 1 : data['result'] === 'no_relevant' ? 0 : 2;
        dataTrain.push(data)
    }).on('end', () => {
        let data = [];
        let labels = [];
        for (const item of dataTrain) {
            data.push([
                item[FeaturesConst.URL_RELEVANT],
                item[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT_PARENT],
                item[FeaturesConst.URL_RELEVANT_PARENT],
                item[FeaturesConst.TERM_CRITERION_PARENT],
                item[FeaturesConst.ONE_ITEM_CRITERIO_PARENT],
                item[FeaturesConst.MORE_ITEM_CRITERIO_PARENT],
                item[FeaturesConst.URL_RELEVANT_BRORHER],
                item[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT_BRORHER],
                item[FeaturesConst.ONE_ITEM_CRITERIO_BRORHER],
                item[FeaturesConst.MORE_ITEM_CRITERIO_BRORHER],
                item[FeaturesConst.TERM_CRITERION_BRORHER],

            ]);

            labels.push(item['result'])
        }

        let seventyPercent = Math.round((data.length * 70)/100)

        let trainFeats = data.splice(0, seventyPercent-1);
        let trainLabels = labels.splice(0, seventyPercent-1)

        let test = data;
        let testResult = labels;

        let nbModel = new MultinomialNB();
        nbModel.train(trainFeats, trainLabels);

        let count = 0;

        for (let i = 0; i < test.length; i++) {
            let predictValue = nbModel.predict([test[i]]);
            console.log("===================predict value: ", predictValue)
            console.log("===================result  value: ", testResult[i])
            console.log("=============acertou : ", predictValue[0] === testResult[i])
            count =  predictValue[0] === testResult[i] ? count + 1  : count;
            console.log("=====", count);
        }

        console.log("=================%%%%: ", (count*100)/test.length)


    });


let weather = ['Sunny', 'Sunny', 'Overcast', 'Rainy', 'Rainy', 'Rainy', 'Overcast', 'Sunny', 'Sunny',
    'Rainy', 'Sunny', 'Overcast', 'Overcast', 'Rainy'];

// [['sunny', 'hot']] == 'yes'

//features
let weather_converted = [[2, 1, 1], [2, 1, 1], [0, 1, 0], [1, 2, 0], [1, 0, 0], [1, 0, 0], [0, 0, 0], [2, 2, 0], [2, 0, 0], [1, 2, 0], [2, 2, 0], [0, 2, 0], [0, 1, 0], [1, 2, 0]];

let temp = ['Hot', 'Hot', 'Hot', 'Mild', 'Cool', 'Cool', 'Cool', 'Mild', 'Cool', 'Mild', 'Mild', 'Mild', 'Hot', 'Mild']

let play = ['No', 'No', 'Yes', 'Yes', 'Yes', 'No', 'Yes', 'No', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'No']

//label
let play_converted = [0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0];

var model = new GaussianNB();
model.train(weather_converted, play_converted);

var predictions = model.predict([[2, 1, 1]]);

console.log("teste", predictions)
