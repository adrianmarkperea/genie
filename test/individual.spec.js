import { Individual } from '../src/individual';
import ChromosomeStub from './chromosome-stub';

import chai from 'chai';
const { assert } = chai;

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
