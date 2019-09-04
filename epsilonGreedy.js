'use-strict';

export default class EpsilonGreedy {
    
    constructor ({epsilon, n}) {
        this.epsilon = epsilon;
        this.n = n;
        
        //init arrays with length n variable and 0 values
        this.counts = Array(n).fill(0);
        this.values = Array(n).fill(0);    
    }
    
    selectArm(){
        if (Math.random() > this.epsilon){

            //todo computer score to node (urls, componentes acessíveis)
            // TODO CODE

            //Select Index with max payoff 
            return this.values.indexOf(Math.max(...this.values));

        }else{
            //Select Index of randomly 
            return this.randomIntFromRange(0, this.n)
        }
    }

    update(i, reward) {
        const n = ++this.counts[i];
        const v = this.values[i];
        this.values[i] = (v * (n - 1) + reward) / n
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
        max = Math.floor(max-1);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
