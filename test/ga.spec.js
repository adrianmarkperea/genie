import ChromosomeStub from './chromosome-stub';
import Individual from '../src/individual';
import * as ga from '../src/ga';

import chai from 'chai';
const { assert } = chai;

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
