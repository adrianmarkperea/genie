function selection(population, numParents, selectionFunction) {
  return selectionFunction(population, numParents);
}

function rouletteWheel(population, num) {
  const wheel = _makeWheel(population);

  const parents = Array(num)
    .fill(null)
    .map(() => _getParentByRouletteWheel(wheel, population));

  return parents;
}

function _makeWheel(population) {
  const totalFitness = population.reduce(
    (total, individual) => total + individual.fitness,
    0
  );

  // If all individuals have 0 fitness,
  // we should make all individuals have equal chances of getting chosen
  const relativeFitnesses =
    totalFitness !== 0
      ? population.map((individual) => individual.fitness / totalFitness)
      : Array(population.length)
          .fill(null)
          .map(() => 1 / population.length);

  const wheel = relativeFitnesses.reduce((probabilities, fitness, index) => {
    index === 0
      ? probabilities.push(fitness)
      : probabilities.push(probabilities[index - 1] + fitness);

    return probabilities;
  }, []);

  return wheel;
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

function stochasticUniversalSampling(population, num) {
  const wheel = _makeWheel(population);

  // Since the wheel is normalized to [0..1],
  // we simply get the pointer the locations by slicing 1
  // with the number of parents to keep
  const pointerDistance = 1 / num;

  const start = Math.random() * pointerDistance;
  const pointers = Array(num)
    .fill(null)
    .map((_, i) => start + i * pointerDistance);

  const parentIndices = pointers.map((pointer) =>
    _modifiedBinarySearch(wheel, pointer)
  );

  return parentIndices.map((index) => population[index]);
}

export { selection, rouletteWheel, stochasticUniversalSampling };
