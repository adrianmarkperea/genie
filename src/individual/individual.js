class Individual {
  constructor(dna = []) {
    this.fitness = 0;
    this.dna = dna;
  }

  addChromosome(chromosome) {
    this.dna.push(chromosome);
  }

  fromTheLikenessOf() {
    const likeness = new Individual();
    this.dna.forEach((chromosome) => {
      likeness.addChromosome(
        chromosome.constructor.fromLength(chromosome.length)
      );
    });

    likeness.fitness = 0;

    return likeness;
  }
}

export default Individual;
