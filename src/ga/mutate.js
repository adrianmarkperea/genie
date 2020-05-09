export function mutate(child, rate) {
  child.dna = child.dna.map((chromosome) => {
    const mutatedGenes = chromosome.genes.map((gene) =>
      Math.random() < rate ? chromosome.mutate(gene) : gene
    );

    return chromosome.constructor.fromGenes(mutatedGenes);
  });
}
