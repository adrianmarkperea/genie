export function getSelectionFunction(type) {
  if (type === undefined) {
    throw new Error('No type was supplied');
  }

  // TODO: implement other types of selection methods
  switch (type) {
    case 'rws':
      return rouletteWheel;
    default:
      throw new Error(`type ${type} is not a valid selection function type`);
  }
}

export function rouletteWheel(population, num) {
  const wheel = _makeWheel(population);

  const parents = Array(num)
    .fill(null)
    .map(() => _getParentByRouletteWheel(wheel, population));

  return parents;
}

// TODO: Probably change this to binary search
function _getParentByRouletteWheel(wheel, population) {
  const chance = Math.random();
  const index = wheel.map((p) => chance < p).indexOf(true);
  return population[index];
}

function _makeWheel(population) {
  const totalFitness = population.reduce(
    (total, individual) => total + individual.fitness,
    0
  );

  const relativeFitnesses = population.map(
    (individual) => individual.fitness / totalFitness
  );

  const wheel = relativeFitnesses.reduce((probabilities, fitness, index) => {
    index === 0
      ? probabilities.push(fitness)
      : probabilities.push(probabilities[index - 1] + fitness);

    return probabilities;
  }, []);

  return wheel;
}
