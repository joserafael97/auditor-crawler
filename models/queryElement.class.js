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
    
    constructor(xpath, typeQuery = QUERYTOSTATICCOMPONENT) {
        this.xpath = xpath;
        this.typeQuery = typeQuery;
    }

    getXpath(){
        return this.xpath;
    }

    getTypeQuery(){
        return this.typeQuery;
    }
}