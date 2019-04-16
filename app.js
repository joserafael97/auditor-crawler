'use strict';
import Item from './models/item.model'
import logger from './core/logger/app-logger'
import connectToDb from './db/connect'

let itemToAdd = Item({
    name: 'teste item',
    found: true,
    foundText: 'teste encontrado',
    xpath: '*//[sdks == sas]',
    pathSought: '',
    proof: '',
    proofText: ''
});
connectToDb();

try {
    const savedItem = Item.addItem(itemToAdd);
    logger.info('Item saved...');
    console.log('added: ' + savedItem);
} catch (err) {
    logger.error('Error in- ' + err);
    console.log('Got error in getAll');
}