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

    constructor(xpath, keyword, typeQuery = QUERYTOSTATICCOMPONENT) {
        this.xpath = xpath;
        this.keyword = keyword;
        this.typeQuery = typeQuery;
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
}