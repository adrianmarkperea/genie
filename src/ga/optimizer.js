export const maximizer = (individualA, individualB) =>
  individualB.fitness - individualA.fitness;

export const minimizer = (individualA, individualB) =>
  individualA.fitness - individualB.fitness;
