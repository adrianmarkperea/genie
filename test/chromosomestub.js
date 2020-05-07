import Chromosome from '../src/chromosomes/chromosome';

class ChromsomeStub extends Chromosome {
  constructor() {
    super();
  }

  generate() {
    return 'A';
  }
}

export default ChromsomeStub;
