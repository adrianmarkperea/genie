/*eslint no-unused-vars: ["error", { "args": "none" }]*/

class Chromosome {
  constructor() {
    if (this.constructor === Chromosome) {
      throw new Error('Cannot instantiate abstract class');
    }
  }

  static fromGenes(genes) {
    if (!genes.every((gene) => this.charset.includes(gene))) {
      throw new Error(
        `Supplied genes [${genes}] is not compatible with charset`
      );
    }

    const chromosome = new this();
    chromosome.length = genes.length;
    chromosome.genes = genes;

    return chromosome;
  }

  static fromLength(length) {
    const chromosome = new this();
    chromosome.length = length;
    chromosome.genes = Array(length).fill(null).map(chromosome.generate);
    return chromosome;
  }

  generate() {
    throw new Error('method `generate()` must be implemented.');
  }

  mutate(gene) {
    return this.generate();
  }
}

export default Chromosome;
