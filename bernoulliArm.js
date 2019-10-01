'use-strict';

export default class BernoulliArm {

    constructor(p) {
        this.p = p;
    }

    pull() {
        return Math.random() > this.p ? 0 : 1;
    }

}
