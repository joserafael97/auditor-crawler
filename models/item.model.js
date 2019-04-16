
import mongoose from 'mongoose';

const ItemSchema = mongoose.Schema({
    name: {type: String, required: true, unique: false, index: true},
    found: {type: Boolean, required: true}, 
    foundText: {type: String}, 
    xpath: {type: String}, 
    pathSought: {type: String}, 
    proof: {type: String}, 
    proofText: {type: String},
}, {collection : 'Item'});

let ItemModel = mongoose.model('Item', ItemSchema);

ItemModel.getAll = () => {
    return ItemModel.find({});
};

ItemModel.addItem = (itemToAdd) => {
    return itemToAdd.save();
};

ItemModel.removeItem = (itemId) => {
    return ItemModel.remove({id: itemId});
};

export default ItemModel;