import Chromosome from '../src/chromosomes/chromosome';

class ChromosomeStub extends Chromosome {
  constructor() {
    super();
  }

  generate() {
    return 'A';
  }
}

ChromosomeStub.charset = ['A', 'B'];

export default ChromosomeStub;
