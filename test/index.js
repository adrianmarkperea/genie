import MockChromosome from '../src/chromosomes/mock';
import chai from 'chai';

const { assert } = chai;

describe('MockChromsome', function () {
  const genes = ['A', 'A', 'A', 'A', 'A'];
  const length = 5;

  it('Should not throw an error when instantiated', function () {
    assert.doesNotThrow(MockChromosome.constructor);
  });

  it('Should be able to be created from genes', function () {
    const chromosome = new MockChromosome().fromGenes(genes);

    assert.sameOrderedMembers(chromosome.genes, genes);
    assert.equal(chromosome.length, length);
  });

  it('Should be able to be created from length', function () {
    const chromosome = new MockChromosome().fromLength(length);

    assert.sameOrderedMembers(chromosome.genes, genes);
    assert.equal(chromosome.length, length);
  });
});
