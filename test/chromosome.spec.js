import { Chromosome } from '../src/chromosomes';
import ChromosomeStub from './chromosome-stub';

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
