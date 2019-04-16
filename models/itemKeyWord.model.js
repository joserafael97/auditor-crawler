
import mongoose from 'mongoose';

const ItemKeyWordSchema = mongoose.Schema({
    name: {type: String, required: true},
    identificationKeyWord: [{type: String, required: true}], 
}, {collection : 'ItemKeyWord'});

let ItemKeyWordModel = mongoose.model('ItemKeyWord', ItemKeyWordSchema);

ItemKeyWordModel.getAll = () => {
    return ItemKeyWordModel.find({});
};

ItemKeyWordModel.addItemKeyWords = (ItemKeyWordToAdd) => {
    return ItemKeyWordToAdd.save();
};

ItemKeyWordModel.removeItemKeyWord = (itemKeyWordId) => {
    return ItemModel.remove({id: itemKeyWordId});
};

export default ItemKeyWordModel;