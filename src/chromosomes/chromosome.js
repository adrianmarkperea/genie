/*eslint no-unused-vars: ["error", { "args": "none" }]*/

class Chromosome {
  constructor() {
    if (this.constructor === Chromosome) {
      throw new Error('Cannot instantiate abstract class');
    }
  }

  fromGenes(genes) {
    this.length = genes.length;
    this.genes = genes;
    return this;
  }

  fromLength(length) {
    this.length = length;
    this.genes = Array(length).fill(null).map(this.generate);
    return this;
  }

  generate() {
    throw new Error('method `generate()` must be implemented.');
  }

  mutate(gene) {
    return this.generate();
  }
}

export default Chromosome;
