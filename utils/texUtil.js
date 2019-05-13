import HtmlUtil from "../utils/htmlUtil";

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

            if (text === array[index] || text.includes(array[index])) {
                return true;
            }
    
        }
        return false;
    }

    static getUrlsNodes (array){
        let urls = [];
        for (let index = 0; index < array.length; index++) {
            const value = array[index].getSource().getValue();
            if (HtmlUtil.isUrl(value)) {
                urls.push(value);
            }
    
        }
        return urls;
    }

}