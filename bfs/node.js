'use strict';

export default class Node {

    constructor(source, parent = null, edges=null, researched = false) {
        this.source = source;
        this.edges = edges;
        this.parent = parent;
        this.researched = researched;
    }

    addEdge(edge){
        this.edges.push(edge);
    }

    getSource() {
        return this.source;
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

    setParent(parent) {
        this.parent = parent;
    }

    setEdges(edges) {
        this.edges = edges;
    }
}
