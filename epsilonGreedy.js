'use-strict';

export default class EpsilonGreedy {

    constructor(n_arms, epsilon_decay) {
        this.n = n_arms
        this.decay = epsilon_decay;
        this.counts = Array(n_arms).fill(0);
        this.values = Array(n_arms).fill(0);
    }

    chooseArm() {
        const randomValue = Math.random();
        const epsilon = this.getEpsilon();

        console.log("Math.random() = ", randomValue)
        console.log("epsilon = ", epsilon)


        if (randomValue > epsilon) {
            //Exploit (use best arm)
            return this.values.indexOf(Math.max(...this.values));
        } else {
            //Explore (test all arms)
            return this.randomIntFromRange(0, this.n);
        }
    }

    updateNumArms(numArms) {
        this.n = numArms
    }

    update(indexArm, reward) {
        this.counts[indexArm] = this.counts[indexArm] + 1;
        const n = this.counts[indexArm];
        const value = this.values[indexArm];
        const new_value = ((n - 1) / parseFloat(n)) * value + (1 / parseFloat(n)) * reward;
        console.log("============n=", n)
        console.log("============value=",value )
        console.log("============reward=", reward)

        console.log("============new value::", new_value)
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
        const total = this.counts.reduce((a, b) => a + b, 0)
        const newEpsilon = parseFloat(this.decay) / (total + parseFloat(this.decay))
        console.log("-------ep----", newEpsilon)
        return newEpsilon
    }


    selectRandomNode(node, queue, index) {
        if (node.getEdges().length > 0) {
            const newNode = node.getEdges()[this.randomIntFromRange(0, node.getEdges().length)]

            for (let i = 0; i < queue.length; i++) {
                if (queue[i] === newNode) {
                    queue.splice(index, 1);
                    return newNode
                }
            }           
        }else{
            this.update(index, 0);
            this.node.setRewardValue(0)
            console.log("this.values:;;", this.values)
            return this.selectRandomNode(elementsAccessed[this.chooseArm()], queue, index, elementsAccessed)
        }
    }
}
