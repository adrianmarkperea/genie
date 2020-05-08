class Individual {
  constructor(dna = []) {
    this.fitness = 0;
    this._dna = dna;
  }

  addChromosome(chromosome) {
    this._dna.push(chromosome);
  }

  get dna() {
    if (this._dna.length === 1) {
      return this._dna[0];
    }

    return this._dna;
  }

  fromTheLikenessOf() {
    const likeness = new Individual();
    this._dna.forEach((chromosome) => {
      likeness.addChromosome(
        chromosome.constructor.fromLength(chromosome.length)
      );
    });

    return likeness;
  }
}

export default Individual;
