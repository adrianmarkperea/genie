export function selection(population, numParents, type) {
  const selectionFunction = getSelectionFunction(type);
  return selectionFunction(population, numParents);
}

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

function _getParentByRouletteWheel(wheel, population) {
  const chance = Math.random();
  const index = _modifiedBinarySearch(wheel, chance);
  return population[index];
}

function _modifiedBinarySearch(array, target, l = 0, r = array.length - 1) {
  if (l > r) {
    return -1;
  }

  const m = Math.floor((l + r) / 2);
  if (
    (m !== 0 && array[m - 1] < target && target <= array[m]) ||
    (m === 0 && target <= array[m])
  ) {
    return m;
  } else if (m === 0 && target <= array[m]) {
    return m;
  } else if (array[m] < target) {
    return _modifiedBinarySearch(array, target, m + 1, r);
  } else if (array[m] > target) {
    return _modifiedBinarySearch(array, target, l, m - 1);
  } else {
    return -1;
  }
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
