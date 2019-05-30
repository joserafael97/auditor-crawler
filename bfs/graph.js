'use strict';

export default class Graph {

    constructor(nodes = [], graph = {}) {
        this.nodes = nodes;
        this.graph = graph;
        this.start = null;
    }

    addNode(node) {
        this.nodes.push(node);
    }

    getNode(nodeSearch) {
        return this.nodes.filter((node) => node.url == nodeSearch.url)[0]
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

    setStartNode(node) {
        this.start = node;
    }
}
