export function getCrossoverFunction(type) {
  if (type === undefined) {
    throw new Error('No type was supplied');
  }

  switch (type) {
    case 'onepoint':
      return () => {};
    default:
      throw new Error(`type ${type} is not a valid crossover function type`);
  }
}
