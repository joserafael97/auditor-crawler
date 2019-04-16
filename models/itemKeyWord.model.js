
import mongoose from 'mongoose';

const ItemKeyWordSchema = mongoose.Schema({
    name: { type: String, required: true },
    identificationKeyWord: [{ type: String, required: true }],
}, { collection: 'ItemKeyWord' });

let ItemKeyWordModel = mongoose.model('ItemKeyWord', ItemKeyWordSchema);

ItemKeyWordModel.getAll = () => {
    return ItemKeyWordModel.find({});
};

ItemKeyWordModel.addItemKeyWords = async (ItemKeyWordToAdd) => {
    async (dispatch) => {
        try {
            itemKeyWord = await ItemKeyWordToAdd.save();
            return itemKeyWord;
        } catch (error) {
            dispatch({ type: EMAIL_FETCHING, payload: false });
            throw new Error(error);
        }

    }
};

ItemKeyWordModel.removeItemKeyWord = (itemKeyWordId) => {
    return ItemModel.remove({ id: itemKeyWordId });
};

export default ItemKeyWordModel;