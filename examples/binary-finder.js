const genie = require('../lib');

const { Simulation, Individual, Chromosome } = genie;

// Define our simulation
class BinaryGuesser extends Simulation {
  calculateFitness(individual, data) {
    const fitness = individual
      .getDna(0)
      .reduce(
        (current, gene, i) => (gene === data.target[i] ? current + 1 : current),
        0
      );

    return fitness;
  }

  shouldFinish(top) {
    return top.fitness === this.data.target.length;
  }
}

// Randomly create a 1 or a 0
const generate = () => (Math.random() < 0.5 ? 1 : 0);

// Mutate each gene if a random variable is less than the mutation rate
// Each gene, in this case, is a 1 or a 0, up to the given length
const mutate = (genes, rate) =>
  genes.map((gene) => {
    if (Math.random() < rate) {
      return gene === 1 ? 0 : 1;
    } else {
      return gene;
    }
  });

// Create our chromosome
const binary = new Chromosome(20, generate, mutate);

// Compose our individual
const individual = new Individual(binary);

// This is also valid
//
// const individual = new Individual;
// individual.addChromosome(binary);

// Create our configuration

const generateTarget = (length) => {
  return Array(length)
    .fill(null)
    .map(() => (Math.random() < 0.5 ? 1 : 0));
};

const target = generateTarget(20);
console.log('Target:', target.join(''));

const config = {
  prototype: individual,
  data: { target },
  mutationRate: 0.01,
  maxGenerations: 1000,
  onCalculateFitness(state) {
    console.log(state.top.fitness, state.top.getDna(0).join(''));
  },
};

const sim = new BinaryGuesser(config);
sim.start();
