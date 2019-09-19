'use strict';

import FeaturesConst from '../consts/featuares';


export default class Node {

    constructor(source, parent = null, edges = [], researched = false) {
        this.source = source;
        this.edges = edges;
        this.parent = parent;
        this.researched = researched;
        this.rewardValue = 0;
        this.features = {
        };
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

    setFeatures(feat) {
        this.features = feat;
    }

    getFeatures() {
        return this.features
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

    getMaxReward() {
        if (this.parent !== null) {
            let it = this.maxReward(this.parent);
            let result = it.next();

            while (!result.done) {
                result = it.next();
            }
            const reward = result.maxReward
            return reward;
        } else {
            return 0;
        }
    }

    maxReward(node) {
        let nodeActualy = node;

        let iterationCount = 0;
        let maxReward = 0;

        const rangeIterator = {
            next: function () {
                let result;
                if (nodeActualy.parent !== undefined && nodeActualy.parent !== null) {
                    result = {
                        treeLevel: iterationCount,
                        done: false,
                    }
                    nodeActualy = nodeActualy.getParent();
                    iterationCount++;
                    maxReward = maxReward + nodeActualy.rewardValue;
                    return result;
                } else {
                    return {
                        treeLevel: iterationCount,
                        done: true,
                        maxReward: maxReward
                    }
                }

            }
        };
        return rangeIterator;
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

    setRewardValue(value) {
        this.rewardValue = value;
    }

    getRewardValue() {
        return this.rewardValue;
    }
}