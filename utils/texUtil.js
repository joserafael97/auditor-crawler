export default class TextUtil {
    
    static normalizeText(text) {
        text = text.replace('-', '').replace(':', '').replace('º', '').replace('°', '').replace(/\s/g,'')
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        return text.toLowerCase();
    }

}