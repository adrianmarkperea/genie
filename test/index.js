import Chromosome from '../src/chromosomes/chromosome';
import ChromosomeStub from './chromosomestub';
import chai from 'chai';

const { assert } = chai;

describe('Chromosome ABC', function () {
  it('Should throw an error when instantiated', function () {
    assert.throws(() => new Chromosome());
  });
});

describe('MockChromsome', function () {
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
