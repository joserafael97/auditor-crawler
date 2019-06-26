'use strict';


export default class Element {

    constructor(value, element, xpath, typeElement, puppeteerInstance, url, isExtractIframe = false) {
        this.xpath = xpath;
        this.element = element;
        this.typeElement = typeElement;
        this.value = value;
        this.puppeteerInstance = puppeteerInstance;
        this.url = url;
        this.isExtractIframe = isExtractIframe;

    }


    getIsExtractIframe() {
        return this.isExtractIframe;
    }


    getXpath() {
        return this.xpath;
    }

    getTypeElement() {
        return this.typeElement;
    }

    getElement() {
        return this.element;
    }

    getValue() {
        return this.value;
    }

    getPuppeteerInstance() {
        return this.puppeteerInstance;
    }

    getUrl() {
        return this.url;
    }

    setUrl(url) {
        this.url = url;
    }
}