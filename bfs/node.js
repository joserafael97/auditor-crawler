'use strict';



export default class Node {

    constructor(source, parent = null, edges = null, researched = false) {
        this.source = source;
        this.edges = edges;
        this.parent = parent;
        this.researched = researched;
    }

    getLevel() {
        if (this.parent !== null) {
            let it = this.accessParents(this.parent);
            let result = it.next();

            while (!result.done) {
                result = it.next();
            }
            return result.treeLevel;
        } else {
            return 0;
        }
    }

    getSourcesParents() {
        if (this.parent !== null) {
            let it = this.accessParents(this.parent);
            let result = it.next();

            while (!result.done) {
                result = it.next();
            }
            return result.sources;
        } else {
            return [];
        }
    }

    accessParents(node) {
        let nodeActualy = node;

        let iterationCount = 0;

        let sources = [];

        const rangeIterator = {
            next: function () {
                let result;
                if (nodeActualy.parent !== undefined && nodeActualy.parent !== null) {
                    sources.push(nodeActualy.source);
                    result = {
                        treeLevel: iterationCount,
                        done: false,
                    }
                    nodeActualy = nodeActualy.getParent();
                    iterationCount++;
                    return result;
                } else {
                    return {
                        treeLevel: iterationCount,
                        done: true,
                        sources: sources
                    }
                }

            }
        };
        return rangeIterator;
    }

    addEdge(edge) {
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