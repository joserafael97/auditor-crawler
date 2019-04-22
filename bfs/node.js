'use strict';

export default class Node {

    constructor(url, edges=[], parent = null, researched = false) {
        this.url = url;
        this.edges = edges;
        this.parent = parent;
        this.researched = researched;
    }

    addEdge(edge){
        this.edges.push(edge);
    }

    getUrl() {
        return this.url;
    }

    getEdges() {
        return this.edges;
    }

    getParent() {
        return this.parent;
    }

    getResearched() {
        return this.researched;
    }

    setResearched(researched) {
        this.researched = researched;
    }
}
