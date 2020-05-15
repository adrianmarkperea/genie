import { Individual } from '../src/individual';
import { Chromosome } from '../src/chromosomes';

import chai from 'chai';
const { assert } = chai;

describe('Individual', function () {
  const mock = new Chromosome(6, () => 'A');

  it('Should have a fitness of 0 when instantiated', function () {
    const individual = new Individual();
    assert.equal(individual.fitness, 0);
  });

  it('Should have an empty dna when instantiated with no arguments', function () {
    const individual = new Individual();
    assert.equal(individual.dna.length, 0);
  });

  it('Should accept a dna as a constructor argument', function () {
    const dna = [mock];

    const individual = new Individual(dna);

    assert.equal(individual.dna[0], dna[0]);
  });

  describe('#addChromosome()', function () {
    it('Should add new chromosomes to the dna', function () {
      const individual = new Individual();

      individual.addChromosome(mock);

      assert.equal(individual.dna[0], mock);
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

      individual.addChromosome(mock);
      const likeness = individual.fromTheLikenessOf();

      assert.equal(individual.dna.length, likeness.dna.length);
    });

    it('Should not have the same dna reference', function () {
      const individual = new Individual();

      individual.addChromosome(mock);
      const likeness = individual.fromTheLikenessOf();

      assert.notEqual(likeness.dna, individual.dna);
    });

    it('Should not have the same chromosome reference', function () {
      const individual = new Individual();
      const chromosomeOne = mock.createRandomCopy();
      const chromosomeTwo = mock.createRandomCopy();

      individual.addChromosome(chromosomeOne);
      individual.addChromosome(chromosomeTwo);
      const likeness = individual.fromTheLikenessOf();

      assert.notEqual(likeness.dna[0], individual.dna[0]);
      assert.notEqual(likeness.dna[1], individual.dna[1]);
    });

    it('Should have the same chromosome type', function () {
      const individual = new Individual();
      const chromosomeOne = mock.createRandomCopy();
      const chromosomeTwo = mock.createRandomCopy();

      individual.addChromosome(chromosomeOne);
      individual.addChromosome(chromosomeTwo);
      const likeness = individual.fromTheLikenessOf();

      assert.instanceOf(likeness.dna[0], Chromosome);
      assert.instanceOf(likeness.dna[1], Chromosome);
    });
  });
});
