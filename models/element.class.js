'use strict';


export default class Element {

    constructor(value, element, xpath, typeElement, url, isExtractIframe = false) {
        this.xpath = xpath;
        this.element = element;
        this.typeElement = typeElement;
        this.value = value;
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


    getUrl() {
        return this.url;
    }

    setUrl(url) {
        this.url = url;
    }

    setIsExtractIframe(isExtractIframe) {
        this.isExtractIframe = isExtractIframe;
    }
}