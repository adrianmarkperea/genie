export function getCrossoverFunction(type) {
  if (type === undefined) {
    throw new Error('No type was supplied');
  }

  switch (type) {
    case 'rws':
      return rouletteWheel;
    case 'sus':
      return null;
    default:
      throw new Error(`type ${type} is not a valid selection function type`);
  }
}

export function rouletteWheel(population, num) {
  const totalFitness = population.reduce(
    (total, individual) => total + individual.fitness,
    0
  );
  const relativeFitnesses = population.map(
    (individual) => individual.fitness / totalFitness
  );
  const probabilities = relativeFitnesses.reduce(
    (probabilities, fitness, index) => {
      index === 0
        ? probabilities.push(fitness)
        : probabilities.push(probabilities[index - 1] + fitness);

      return probabilities;
    },
    []
  );

  const parents = Array(num)
    .fill(null)
    .map(() => {
      const chance = Math.random();
      const index = probabilities.map((p) => chance < p).indexOf(true);
      return population[index];
    });

  return parents;
}
