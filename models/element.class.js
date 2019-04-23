
'use strict';


export default class Element {
    
    constructor(value, element, xpath, typeElement) {
        this.xpath = xpath;
        this.element = element;
        this.typeElement = typeElement;
        this.value = value;
    }

    getXpath(){
        return this.xpath;
    }

    getTypeElement(){
        return this.typeElement;
    }

    getElement(){
        return this.element;
    }

    getValue(){
        return this.value;
    }
}