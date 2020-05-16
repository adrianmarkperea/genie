class Individual {
  constructor(dna = []) {
    this.fitness = 0;
    this.dna = Array.isArray(dna) ? dna : [dna];
  }

  getDna(index) {
    return this.dna[index].genes;
  }

  addChromosome(chromosome) {
    this.dna.push(chromosome);
  }

  fromTheLikenessOf() {
    const likeness = new Individual();
    this.dna.forEach((chromosome) => {
      likeness.addChromosome(chromosome.createRandomCopy());
    });

    likeness.fitness = 0;

    return likeness;
  }
}

export { Individual };
