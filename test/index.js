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
  const length = 5;

  it('Should not throw an error when instantiated', function () {
    assert.doesNotThrow(() => new ChromosomeStub());
  });

  it('Should be able to be created from genes', function () {
    const chromosome = ChromosomeStub.fromGenes(genes);

    assert.sameOrderedMembers(chromosome.genes, genes);
    assert.equal(chromosome.length, length);
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

    assert.equal(individual.dna, dna[0]);
  });

  it('Should return an individual chromsome when dna length is only one', function () {
    const individual = new Individual();
    const chromosome = ChromosomeStub.fromLength(5);

    individual.addChromosome(chromosome);

    assert.equal(individual.dna, chromosome);
  });

  describe('#addChromosome()', function () {
    it('Should add new chromosomes to the dna', function () {
      const individual = new Individual();
      const chromosome = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosome);

      assert.equal(individual.dna, chromosome);
    });

    it('Should reference the same chromosome that was added', function () {
      const individual = new Individual();
      const chromosome = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosome);

      assert.equal(individual.dna, chromosome);
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

      assert.equal(individual._dna.length, likeness._dna.length);
    });

    it('Should not have the same dna reference', function () {
      const individual = new Individual();
      const chromosome = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosome);
      const likeness = individual.fromTheLikenessOf();

      assert.notEqual(likeness._dna, individual._dna);
    });

    it('Should not have the same chromosome reference', function () {
      const individual = new Individual();
      const chromosomeOne = ChromosomeStub.fromLength(5);
      const chromosomeTwo = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosomeOne);
      individual.addChromosome(chromosomeTwo);
      const likeness = individual.fromTheLikenessOf();

      assert.notEqual(likeness._dna[0], individual._dna[0]);
      assert.notEqual(likeness._dna[1], individual._dna[1]);
    });

    it('Should have the same chromosome type', function () {
      const individual = new Individual();
      const chromosomeOne = ChromosomeStub.fromLength(5);
      const chromosomeTwo = ChromosomeStub.fromLength(5);

      individual.addChromosome(chromosomeOne);
      individual.addChromosome(chromosomeTwo);
      const likeness = individual.fromTheLikenessOf();

      assert.instanceOf(likeness._dna[0], ChromosomeStub);
      assert.instanceOf(likeness._dna[1], ChromosomeStub);
    });
  });
});

describe('ga', function () {
  describe('#getCrossoverFunction()', function () {
    it('Should return a function', function () {
      const crossoverFunc = ga.getCrossoverFunction('onepoint');

      assert.typeOf(crossoverFunc, 'function');
    });

    it('Should throw an error when given a wrong type', function () {
      assert.throws(() => ga.getCrossoverFunction('RASDIOAJ'));
    });

    it('Should throw an error when not given a type', function () {
      assert.throws(() => ga.getCrossoverFunction());
    });
  });
});
