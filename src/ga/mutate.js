export function mutate(child, rate) {
  child.dna = child.dna.map((chromosome) => {
    const mutatedGenes = chromosome.mutate(chromosome.genes, rate);
    return chromosome.copyWithGenes(mutatedGenes);
  });

  return child;
}
