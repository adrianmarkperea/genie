import { randBetween } from './utils/random';

export function crossover(parentOne, parentTwo, type) {
  const crossoverFunc = getCrossoverFunction(type);
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

export function getCrossoverFunction(type) {
  if (type === undefined) {
    throw new Error('No type was supplied');
  }

  switch (type) {
    case 'onepoint':
      return onepoint;
    case 'multipoint':
      return multipoint;
    default:
      throw new Error(`type ${type} is not a valid crossover function type`);
  }
}

export function onepoint(chromosomeOne, chromosomeTwo) {
  const point = randBetween(0, chromosomeOne.length);
  return _onepoint(chromosomeOne, chromosomeTwo, point);
}

export function _onepoint(chromosomeOne, chromosomeTwo, point) {
  const childGenes = chromosomeOne.genes.map((geneOne, i) => {
    const geneTwo = chromosomeTwo.genes[i];
    return i < point ? geneOne : geneTwo;
  });

  return chromosomeOne.constructor.fromGenes(childGenes);
}

export function multipoint(chromosomeOne, chromosomeTwo) {
  const pointOne = randBetween(0, chromosomeOne.length);
  const pointTwo = randBetween(pointOne, chromosomeOne.length);
  return _multipoint(chromosomeOne, chromosomeTwo, pointOne, pointTwo);
}

export function _multipoint(chromosomeOne, chromosomeTwo, pointOne, pointTwo) {
  const childGenes = chromosomeOne.genes.map((geneOne, i) => {
    const geneTwo = chromosomeTwo.genes[i];
    return i < pointOne || i >= pointTwo ? geneOne : geneTwo;
  });

  return chromosomeOne.constructor.fromGenes(childGenes);
}
