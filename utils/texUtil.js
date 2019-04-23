export default class TextUtil {
    
    static normalizeText(text) {
        text = text.replace('-', '').replace(':', '').replace('º', '').replace('°', '')
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        return text.toLowerCase();
    }

    static removeWhiteSpace(text){
        return text.replace(/(\r\n|\n|\r)/gm, '').replace(/ +(?= )/g,'').trim();
    }

}