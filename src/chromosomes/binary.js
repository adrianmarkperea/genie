import Chromosome from './chromosome';

class BinaryChromosome extends Chromosome {
  generate() {
    return Math.random() < 0.5 ? '1' : '0';
  }

  mutate(gene) {
    return gene === '1' ? '0' : '1';
  }
}

BinaryChromosome.charset = ['0', '1'];

export default BinaryChromosome;
