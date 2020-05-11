export function mutate(child, rate, mutator) {
  if (mutator !== null) {
    return mutator(child, rate);
  } else {
    return _mutateByChromosome(child, rate);
  }
}

function _mutateByChromosome(child, rate) {
  child.dna = child.dna.map((chromosome) => {
    const mutatedGenes = chromosome.genes.map((gene) =>
      Math.random() < rate ? chromosome.mutate(gene) : gene
    );

    return chromosome.constructor.fromGenes(mutatedGenes);
  });

  return child;
}
