'use strict';



export default class Node {

    constructor(source, parent = null, edges = [], researched = false) {
        this.source = source;
        this.edges = edges;
        this.parent = parent;
        this.researched = researched;
        this.have_a_father_relevant = false;
        this.have_brother_relevant = false;
    }

    getLevel() {
        if (this.parent !== null) {
            let it = this.accessParents(this.parent);
            let result = it.next();

            while (!result.done) {
                result = it.next();
            }
            return result.treeLevel + 1;
        } else {
            return 0;
        }
    }

    setHaveAFatherRelevant( variable ){
        this.have_a_father_relevant = variable;
    }

    getHaveAFatherRelevant() {
        return this.have_a_father_relevant;
    }

    setHaveBrotherRelevant(variable) {
        this.have_brother_relevant = variable;
    }

    getHaveBrotherRelevant() {
        return this.have_brother_relevant;
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
                    sources.push(nodeActualy);
                    result = {
                        treeLevel: iterationCount,
                        done: false,
                    }
                    nodeActualy = nodeActualy.getParent();
                    iterationCount++;
                    return result;
                } else {
                    sources.push(nodeActualy);
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

    setEdgesList(edges) {
        this.edges = edges;
    }
}