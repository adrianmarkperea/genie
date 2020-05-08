import Chromosome from '../src/chromosomes/chromosome';
import ChromosomeStub from './chromosomestub';
import Individual from '../src/individual';
import * as ga from '../src/ga';

import chai from 'chai';
const { assert } = chai;

describe('Chromosome ABC', function () {
  it('Should throw an error when instantiated', function () {
    assert.throws(() => new Chromosome());
  });
});

describe('MockChromosome', function () {
  const genes = ['A', 'A', 'A', 'A', 'A'];
  const badGenes = ['A', 'B', 'C'];
  const length = 5;

  it('Should not throw an error when instantiated', function () {
    assert.doesNotThrow(() => new ChromosomeStub());
  });

  it('Should be able to be created from genes', function () {
    const chromosome = ChromosomeStub.fromGenes(genes);

    assert.sameOrderedMembers(chromosome.genes, genes);
    assert.equal(chromosome.length, length);
  });

  it('Should throw an error when supplied with genes not part of charset', function () {
    assert.throws(() => ChromosomeStub.fromGenes(badGenes));
  });

  it('Should be able to be created from length', function () {
    const chromosome = ChromosomeStub.fromLength(length);

    assert.sameOrderedMembers(chromosome.genes, genes);
    assert.equal(chromosome.length, length);
  });
});

describe('Individual', function () {
  it('Should have a fitness of 0 when instantiated', function () {
    const individual = new Individual();
    assert.equal(individual.fitness, 0);
  });

  it('Should have an empty dna when instantiated with no arguments', function () {
    const individual = new Individual();
    assert.equal(individual.dna.length, 0);
  });

  it('Should accept a dna as a constructor argument', function () {
    const dna = [ChromosomeStub.fromLength(5)];

    const individual = new Individual(dna);

    assert.equal(individual.dna[0], dna[0]);
  });

  it('Should return an individual chromsome when dna length is only one', function () {
    const individual = new Individual();
    const chromosome = ChromosomeStub.fromLength(5);

    individual.addChromosome(chromosome);

    assert.equal(individual.dna[0], chromosome);
  });

  describe('#addChromosome()', function () {
    it('Should add new chromosomes to the dna', function () {
      const individual = new Individual();
      const chromosome = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosome);

      assert.equal(individual.dna[0], chromosome);
    });

    it('Should reference the same chromosome that was added', function () {
      const individual = new Individual();
      const chromosome = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosome);

      assert.equal(individual.dna[0], chromosome);
    });
  });

  describe('#fromTheLikenessOf()', function () {
    it('Should return a new individual instance', function () {
      const individual = new Individual();

      const likeness = individual.fromTheLikenessOf();

      assert.instanceOf(likeness, Individual);
    });

    it('Should have the same dna length', function () {
      const individual = new Individual();
      const chromosome = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosome);
      const likeness = individual.fromTheLikenessOf();

      assert.equal(individual.dna.length, likeness.dna.length);
    });

    it('Should not have the same dna reference', function () {
      const individual = new Individual();
      const chromosome = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosome);
      const likeness = individual.fromTheLikenessOf();

      assert.notEqual(likeness.dna, individual.dna);
    });

    it('Should not have the same chromosome reference', function () {
      const individual = new Individual();
      const chromosomeOne = ChromosomeStub.fromLength(5);
      const chromosomeTwo = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosomeOne);
      individual.addChromosome(chromosomeTwo);
      const likeness = individual.fromTheLikenessOf();

      assert.notEqual(likeness.dna[0], individual.dna[0]);
      assert.notEqual(likeness.dna[1], individual.dna[1]);
    });

    it('Should have the same chromosome type', function () {
      const individual = new Individual();
      const chromosomeOne = ChromosomeStub.fromLength(5);
      const chromosomeTwo = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosomeOne);
      individual.addChromosome(chromosomeTwo);
      const likeness = individual.fromTheLikenessOf();

      assert.instanceOf(likeness.dna[0], ChromosomeStub);
      assert.instanceOf(likeness.dna[1], ChromosomeStub);
    });
  });
});

describe('ga', function () {
  describe('#crossover()', function () {
    it('Should throw an error if no type is supplied', function () {
      assert.throws(() => ga.crossover(null, null, null));
    });

    it('Should return an Individual instance', function () {
      const parentOne = new Individual();
      parentOne.addChromosome(ChromosomeStub.fromGenes(['A', 'A', 'A', 'A']));
      const parentTwo = new Individual();
      parentTwo.addChromosome(ChromosomeStub.fromGenes(['B', 'B', 'B', 'B']));
      const type = 'onepoint';

      const individual = ga.crossover(parentOne, parentTwo, type);

      assert.instanceOf(individual, Individual);
    });
  });

  describe('#getCrossoverFunction()', function () {
    it('Should return a function when called with `onepoint`', function () {
      const crossoverFunc = ga.getCrossoverFunction('onepoint');

      assert.typeOf(crossoverFunc, 'function');
    });

    it('Should return a function when called with `multipoint`', function () {
      const crossoverFunc = ga.getCrossoverFunction('multipoint');

      assert.typeOf(crossoverFunc, 'function');
    });

    it('Should return a function when called with `uniform`', function () {
      const crossoverFunc = ga.getCrossoverFunction('uniform');

      assert.typeOf(crossoverFunc, 'function');
    });

    it('Should throw an error when given a wrong type', function () {
      assert.throws(() => ga.getCrossoverFunction('RASDIOAJ'));
    });

    it('Should throw an error when not given a type', function () {
      assert.throws(() => ga.getCrossoverFunction());
    });
  });

  describe('#_onepoint()', function () {
    it('Should swap genes at a point', () => {
      const chromosomeOne = ChromosomeStub.fromGenes(['A', 'A', 'A', 'A']);
      const chromosomeTwo = ChromosomeStub.fromGenes(['B', 'B', 'B', 'B']);
      const point = 2;
      const expected = ['A', 'A', 'B', 'B'];

      const childChromosome = ga._onepoint(chromosomeOne, chromosomeTwo, point);

      assert.sameOrderedMembers(childChromosome.genes, expected);
    });
  });

  describe('#_multipoint()', function () {
    it('Should swap genes between point one and point two', function () {
      const chromosomeOne = ChromosomeStub.fromGenes([
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
      ]);
      const chromosomeTwo = ChromosomeStub.fromGenes([
        'B',
        'B',
        'B',
        'B',
        'B',
        'B',
      ]);
      const pointOne = 2;
      const pointTwo = 4;
      const expected = ['A', 'A', 'B', 'B', 'A', 'A'];

      const childChromosome = ga._multipoint(
        chromosomeOne,
        chromosomeTwo,
        pointOne,
        pointTwo
      );

      assert.sameOrderedMembers(childChromosome.genes, expected);
    });
  });

  describe('#uniform()', function () {
    it('Should do uniform crossover based on probabilities', function () {
      const chromosomeOne = ChromosomeStub.fromGenes(['A', 'A', 'A', 'A']);
      const chromosomeTwo = ChromosomeStub.fromGenes(['B', 'B', 'B', 'B']);
      const probabilities = [0.2, 0.5, 0.3, 0.9];
      const expected = ['A', 'B', 'A', 'B'];

      const child = ga._uniform(chromosomeOne, chromosomeTwo, probabilities);

      assert.sameOrderedMembers(child.genes, expected);
    });
  });
});
