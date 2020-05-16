class Chromosome {
  constructor(length, generate, mutate) {
    if (length === undefined) {
      throw new Error('length should be defined');
    }

    if (generate === undefined) {
      throw new Error('generate() should be defined');
    }

    this.length = length;
    this.generate = generate;

    if (mutate === undefined) {
      this.mutate = (genes, rate) =>
        genes.map((gene) => (Math.random() < rate ? generate() : gene));
    } else {
      this.mutate = mutate;
    }

    this.genes = Array(length).fill(null);
  }

  _init() {
    this.genes = this.genes.map(this.generate);
  }

  setGenes(genes) {
    if (genes.length !== this.length) {
      throw new Error(
        `Expected genes of length ${this.length}. Got ${genes.length}`
      );
    }

    this.genes = genes;
  }

  copyWithGenes(genes) {
    const copy = new Chromosome(this.length, this.generate, this.mutate);
    copy.setGenes(genes);

    return copy;
  }

  createRandomCopy() {
    const copy = new Chromosome(this.length, this.generate, this.mutate);
    copy._init();
    return copy;
  }
}

export { Chromosome };
