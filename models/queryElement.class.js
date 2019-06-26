'use strict';


const QUERYTODYNAMICELEMENT = 'dynamic';
const QUERYTOSTATICCOMPONENT = 'static';


export {
    QUERYTODYNAMICELEMENT
};
export {
    QUERYTOSTATICCOMPONENT
};

export default class QueryElement {

    constructor(xpath, keyword, typeQuery = QUERYTODYNAMICELEMENT, keywordsXpath = [], isExtractIframe = false) {
        this.xpath = xpath;
        this.keyword = keyword;
        this.typeQuery = typeQuery;
        this.keywordsXpath = keywordsXpath;
        this.isExtractIframe = isExtractIframe;

    }

    getIsExtractIframe() {
        return this.isExtractIframe;
    }

    getXpath() {
        return this.xpath;
    }

    getTypeQuery() {
        return this.typeQuery;
    }

    getKeyWord() {
        return this.keyword;
    }

    getKeyWordsXpath() {
        return this.keywordsXpath;
    }
}