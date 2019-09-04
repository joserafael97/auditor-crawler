import BernoulliArm from "./bernoulliArm";
import EpsilonGreedy from "./epsilonGreedy";


function simulate(algoClass, options, arms, horizon){
    let chosenArms = Array(horizon).fill();
    let rewards = Array(horizon).fill();
    let cumulativeRewards = Array(horizon).fill();

    const algo = new algoClass(options);
    let cumulativeReward = 0;
    for (let t = 0 ; t < horizon; t ++){
        const i = algo.selectArm();
        const arm = arms[i];
        const reward = arm.pull();
        algo.update(i, reward);

        chosenArms[t] = i;
        rewards[t] = reward;
        cumulativeReward += reward;
        cumulativeRewards[t] = cumulativeReward;
    }

    return {chosenArms, rewards, cumulativeRewards};
}

const nArms = 5;
let arms = Array(nArms).fill().map(_ => new BernoulliArm(Math.random() / 10))
const results = simulate(EpsilonGreedy, {epsilon: .1, n: nArms}, arms, 100000)


console.log(results.chosenArms)