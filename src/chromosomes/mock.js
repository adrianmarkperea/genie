import Chromosome from './chromosome';

class MockChromosome extends Chromosome {
  constructor() {
    super();
  }

  generate() {
    return 'A';
  }
}

export default MockChromosome;
