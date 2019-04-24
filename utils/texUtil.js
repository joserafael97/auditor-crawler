export default class TextUtil {
    
    static normalizeText(text) {
        text = text.replace('-', '').replace(':', '').replace('º', '').replace('°', '')
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        return text.toLowerCase();
    }

    static removeWhiteSpace(text){
        return text.replace(/(\r\n|\n|\r)/gm, '').replace(/ +(?= )/g,'').trim();
    }

    static checkTextContainsArray (array, text){
        for (let index = 0; index < array.length; index++) {
            if (text.includes(array[index])) {
                return true;
            }
    
        }
        return false;
    }

}