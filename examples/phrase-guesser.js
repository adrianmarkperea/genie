const genie = require('../lib');

const { Simulation, Individual, Chromosome } = genie;

// Define our simulation
class PhraseGuesser extends Simulation {
  calculateFitness(individual, data) {
    const fitness = individual
      .getDna(0)
      .reduce(
        (current, gene, i) =>
          gene === data.target.charAt(i) ? current + 1 : current,
        0
      );

    return fitness / data.target.length;
  }

  shouldFinish(top) {
    return top.fitness === 1;
  }
}

// Randomly create a character from the ASCII Table
const generate = () => {
  const charset = 'abcdefghijklmnopqrstuvwxyz ';
  const char = charset[Math.floor(Math.random() * charset.length)];
  return char;
};

// Create our chromosome
// We can leave out mutate to use the default implementation.
// The default implementation will call generate() on each gene
// if the random variable is less than the provided mutation rate
const target = 'to be or not to be';
const lowerletters = new Chromosome(target.length, generate);

// Compose our individual
const individual = new Individual(lowerletters);

const config = {
  prototype: individual,
  data: { target },
  mutationRate: 0.01,
  popSize: 1000,
  numParents: 1000,
  maxGenerations: 10000,
  selection: genie.ga.Selection.stochasticUniversalSampling,
  crossover: genie.ga.Crossover.uniform,
  onCalculateFitness(state) {
    console.log(state.top.fitness, state.top.getDna(0).join(''));
  },
};

const sim = new PhraseGuesser(config);
sim.start();
