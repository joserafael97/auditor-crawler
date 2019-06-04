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

    constructor(xpath, keyword, typeQuery = QUERYTODYNAMICELEMENT, keywordsXpath = []) {
        this.xpath = xpath;
        this.keyword = keyword;
        this.typeQuery = typeQuery;
        this.keywordsXpath = keywordsXpath;
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