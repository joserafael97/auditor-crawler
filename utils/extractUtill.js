'use strict';


export default class ExtractUtil {

    let itemToAdd = Item({
        name: 'teste item2',
        found: true,
        foundText: 'teste encontrado2',
        xpath: '*//[sdks == sas2]',
        pathSought: '',
        proof: '',
        proofText: ''
    });
    connectToDb();
    
    try {
        const savedItem = Item.addItem(itemToAdd);
        logger.info('Item saved...');
        console.log('added: ' + Item.getAll());
    } catch (err) {
        logger.error('Error in- ' + err);
        console.log('Got error in getAll');
    }

}