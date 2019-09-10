
import { GaussianNB } from 'ml-naivebayes';
import { Matrix } from 'ml-matrix';


let weather=['Sunny','Sunny','Overcast','Rainy','Rainy','Rainy','Overcast','Sunny','Sunny',
'Rainy','Sunny','Overcast','Overcast','Rainy'];

// [['sunny', 'hot']] == 'yes'

//features
let weather_converted = [[2, 1, 1], [2, 1, 1], [0, 1, 0], [1, 2, 0], [1, 0, 0], [1, 0, 0], [0, 0, 0], [2, 2, 0], [2, 0, 0], [1, 2, 0], [2, 2, 0], [0, 2, 0], [0, 1, 0], [1, 2, 0]];

let temp=['Hot','Hot','Hot','Mild','Cool','Cool','Cool','Mild','Cool','Mild','Mild','Mild','Hot','Mild']

let play=['No','No','Yes','Yes','Yes','No','Yes','No','Yes','Yes','Yes','Yes','Yes','No']

//label
let play_converted = [0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0];

var model = new GaussianNB();
model.train(weather_converted, play_converted);

var predictions = model.predict([[0, 1, 0]]);

console.log("teste", predictions)