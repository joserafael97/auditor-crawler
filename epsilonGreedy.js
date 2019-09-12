'use-strict';

export default class EpsilonGreedy {

    constructor(n_arms, epsilon_decay) {
        this.n = n;
        this.decay = epsilon_decay;
        this.counts = Array(n).fill(0);
        this.values = Array(n).fill(0);
        this.n = n_arms
    }

    chooseArm() {
        randomValue = Math.random();
        console.log("Math.random() = ", randomValue)
        console.log("this.epsilon = ", this.epsilon)
        
        const epsilon = this.getEpsilon();

        if (randomValue > epsilon) {
            //Exploit (use best arm)
            return this.values.indexOf(Math.max(...this.values));
        } else {
            //Explore (test all arms)
            return this.randomIntFromRange(0, this.n);
        }
    }

    update(indexArm, reward){
        this.counts[indexArm] = this.counts[indexArm] + 1;
        n = this.counts[indexArm];
        const value = this.values[indexArm];
        new_value = ((n - 1) / float(n)) * value + (1 / float(n)) * reward;
        this.values[indexArm] = new_value;
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */
    randomIntFromRange(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max - 1);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getEpsilon() {
        total = this.counts.reduce((a, b) => a + b, 0)

        newEpsilon = float(this.decay) / (total + float(this.decay))
        console.log("-------ep----", newEpsilon)
        return newEpsilon
    }
}
