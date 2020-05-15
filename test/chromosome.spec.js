import { Chromosome } from '../src/chromosomes';

import chai from 'chai';
const { assert } = chai;

describe('Chromosome', function () {
  it('Should throw an error if instantiated without length', function () {
    assert.throws(() => new Chromosome());
  });

  it('Should throw an error when instantiated without generate', function () {
    assert.throws(() => new Chromosome(4));
  });

  it('Should have a mutate method when not provided', function () {
    const mock = new Chromosome(4, () => 'A');
    assert.isDefined(mock.mutate);
  });

  it('Should have genes when not provided', function () {
    const mock = new Chromosome(4, () => 'A');
    assert.isDefined(mock.genes);
  });

  it('Should return a new chromosome when copied with genes', function () {
    const mock = new Chromosome(4, () => 'A');
    const newGenes = ['A', 'A', 'A', 'A'];

    const copy = mock.copyWithGenes(newGenes);

    assert.instanceOf(copy, Chromosome);
    assert.includeMembers(copy.genes, newGenes);
  });

  it('Should return a new chromosome when creating a random copy', function () {
    const mock = new Chromosome(4, () => 'A');

    const copy = mock.createRandomCopy();

    assert.instanceOf(copy, Chromosome);
  });
});
