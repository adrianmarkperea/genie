/*eslint no-unused-vars: ["error", { "args": "none" }]*/
import { crossover, getSelectionFunction, mutate } from '../ga';
import { randBetween } from '../utils/random';

class Simulation {
  constructor({
    prototype,
    popSize = 100,
    maxGenerations = 1000,
    numParents = 10,
    selection = 'rws',
    crossover = 'uniform',
    mutationRate = 0.01,
    elitism = false,
    onInit = null,
    onUpdate = null,
    onCalculateFitness = null,
    onFinish = null,
  }) {
    if (prototype === undefined) {
      throw new Error('Please provide an Individual as a prototype');
    }

    if (prototype.dna.length === 0) {
      throw new Error('Please add a chromosome to your prototype');
    }

    this.prototype = prototype;
    this.popSize = popSize;
    this.maxGenerations = maxGenerations;
    this.numParents = numParents;
    this.selection = getSelectionFunction(selection);
    this.crossover = crossover;
    this.mutationRate = mutationRate;
    this.elitism = elitism;

    this.population = Array(popSize).fill(null);
    this.currentGeneration = 1;
    this.finished = false;
    this.updateFinished = false;

    this.onInit = onInit;
    this.onUpdate = onUpdate;
    this.onCalculateFitness = onCalculateFitness;
    this.onFinish = onFinish;

    this._init();
  }

  start() {
    while (!this.finished) {
      while (!this.updateFinished) {
        this._update();
      }

      this._calculateFitness();
      this._evaluate();

      if (!this.finished) {
        this._generate();
      }
    }
  }

  _init() {
    this.population = this.population.map(() =>
      this.prototype.fromTheLikenessOf()
    );

    this.init();
    this.onInit && this.onInit(this._getState());
  }

  _update() {
    this.updateFinished = this.update();
    this.onUpdate && this.onUpdate(this._getState());
  }

  _calculateFitness() {
    this.population.forEach(
      (individual) => (individual.fitness = this.calculateFitness(individual))
    );
    this.onCalculateFitness && this.onCalculateFitness(this._getState());
  }

  _evaluate() {
    const top = this.getTopIndividual(this.population);
    if (
      this.shouldFinish(top) ||
      this.currentGeneration === this.maxGenerations
    ) {
      this.finished = true;
      this.onFinish && this.onFinish(this._getState());
    } else {
      this._reset();
    }
  }

  _reset() {
    this.reset();
    this.updateFinished = false;
  }

  _generate() {
    let elites = [];
    if (this.elitism === true) {
      elites = this.population
        .sort((a, b) => b.fitness - a.fitness)
        .slice(0, this.numParents);
    }

    const parents = this.selection(this.population, this.numParents);
    const children = Array(this.popSize - elites.length)
      .fill(null)
      .map(() => {
        // TODO: Fix rand between bug
        const p1Index = randBetween(0, parents.length - 1);
        const p2Index = randBetween(0, parents.length - 1);
        const parentOne = parents[p1Index];
        const parentTwo = parents[p2Index];
        const child = crossover(parentOne, parentTwo, this.crossover);
        mutate(child, this.mutationRate);
        return child;
      });

    this.currentGeneration += 1;

    this.population = [...elites, ...children];
  }

  // TODO: Add stats
  _getState() {
    const userState = this.getState();
    return Object.assign(
      {},
      {
        top: this.getTopIndividual(this.population),
        population: this.population,
      },
      userState
    );
  }

  // Optional Override
  init() {}

  // Optional Override
  getTopIndividual(population) {
    const top = population.reduce((current, individual) => {
      if (current === null) {
        return individual;
      } else {
        return individual.fitness > current.fitness ? individual : current;
      }
    }, null);

    return top;
  }

  // Optional Override
  getState() {
    return {};
  }

  // Optional Override
  update() {
    return true;
  }

  // Optional Override
  reset() {}

  calculateFitness(individual) {
    throw new Error('method `calculateFitness` must be implemented');
  }

  shouldFinish(top) {
    throw new Error('method `shouldFinish` must be implemented');
  }
}

export default Simulation;
