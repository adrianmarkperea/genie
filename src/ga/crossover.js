import { randBetween } from '../utils/random';

function crossover(parentOne, parentTwo, crossoverFunc) {
  const childDna = _getChildDna(parentOne, parentTwo, crossoverFunc);
  return new parentOne.constructor(childDna);
}

function _getChildDna(parentOne, parentTwo, crossoverFunc) {
  const childDna = parentOne.dna.map((parentOneChromosome, i) => {
    const parentTwoChromosome = parentTwo.dna[i];
    return crossoverFunc(parentOneChromosome, parentTwoChromosome);
  });
  return childDna;
}

function onepoint(chromosomeOne, chromosomeTwo) {
  const point = randBetween(0, chromosomeOne.length);
  return _onepoint(chromosomeOne, chromosomeTwo, point);
}

function _onepoint(chromosomeOne, chromosomeTwo, point) {
  const childGenes = chromosomeOne.genes.map((geneOne, i) => {
    const geneTwo = chromosomeTwo.genes[i];
    return i < point ? geneOne : geneTwo;
  });

  return chromosomeOne.constructor.fromGenes(childGenes);
}

function multipoint(chromosomeOne, chromosomeTwo) {
  const pointOne = randBetween(0, chromosomeOne.length);
  const pointTwo = randBetween(pointOne, chromosomeOne.length);
  return _multipoint(chromosomeOne, chromosomeTwo, pointOne, pointTwo);
}

function _multipoint(chromosomeOne, chromosomeTwo, pointOne, pointTwo) {
  const childGenes = chromosomeOne.genes.map((geneOne, i) => {
    const geneTwo = chromosomeTwo.genes[i];
    return i < pointOne || i >= pointTwo ? geneOne : geneTwo;
  });

  return chromosomeOne.constructor.fromGenes(childGenes);
}

function uniform(chromosomeOne, chromosomeTwo) {
  const probabilities = Array(chromosomeOne.length)
    .fill(null)
    .map(() => Math.random());
  return _uniform(chromosomeOne, chromosomeTwo, probabilities);
}

function _uniform(chromosomeOne, chromosomeTwo, probabilities) {
  const childGenes = chromosomeOne.genes.map((geneOne, i) => {
    const geneTwo = chromosomeTwo.genes[i];
    const probability = probabilities[i];
    return probability < 0.5 ? geneOne : geneTwo;
  });

  return chromosomeOne.constructor.fromGenes(childGenes);
}

export { crossover, onepoint, multipoint, uniform };
