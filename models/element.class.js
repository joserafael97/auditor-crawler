
'use strict';


export default class Element {
    
    constructor(value, element, xpath, typeElement, puppeteerInstance) {
        this.xpath = xpath;
        this.element = element;
        this.typeElement = typeElement;
        this.value = value;
        this.puppeteerInstance = puppeteerInstance;
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

    getPuppeteerInstance(){
        return this.puppeteerInstance;
    }
}