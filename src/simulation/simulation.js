/*eslint no-unused-vars: ["error", { "args": "none" }]*/
import { Selection, Crossover, Mutate, Optimizer } from '../ga';
import { randBetween } from '../utils/random';

class Simulation {
  constructor({
    prototype,
    data,
    popSize = 100,
    maxGenerations = 1000,
    numParents = 10,
    selection = Selection.rouletteWheel,
    crossover = Crossover.onepoint,
    mutationRate = 0.01,
    optimizer = Optimizer.maximizer,
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
    this.data = data;
    this.popSize = popSize;
    this.maxGenerations = maxGenerations;
    this.numParents = numParents;
    this.selection = selection;
    this.crossover = crossover;
    this.mutationRate = mutationRate;
    this.optimizer = optimizer;
    this.elitism = elitism;

    this.population = Array(popSize).fill(null);
    this.currentGeneration = 1;
    this.finished = false;
    this.updateFinished = false;
    this.top = null;
    this.averageFitness = 0;
    this.history = [];
    this.rafId = null;

    this.onInit = onInit;
    this.onUpdate = onUpdate;
    this.onCalculateFitness = onCalculateFitness;
    this.onFinish = onFinish;

    this._init();
  }

  start() {
    this.rafId = setTimeout(() => this.loop(), 1 / 60);
  }

  stop() {
    clearTimeout(this.rafId);
    this.rafId = null;
  }

  loop() {
    if (!this.finished) {
      if (!this.updateFinished) {
        this._update();
      }

      this._calculateFitness();
      this._evaluate();

      if (!this.finished) {
        this._generate();
      }
      this.rafId = setTimeout(() => this.loop(), 1 / 60);
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
      (individual) =>
        (individual.fitness = this.calculateFitness(individual, this.data))
    );

    this.population = this.population.sort(this.optimizer);
    this.top = this.population[0];
    this.averageFitness = this._getAverageFitness();

    this.onCalculateFitness && this.onCalculateFitness(this._getState());
  }

  _evaluate() {
    if (
      this.shouldFinish(this.top) ||
      this.currentGeneration === this.maxGenerations
    ) {
      this.finished = true;
      this.onFinish && this.onFinish(this._getState());
    } else {
      this._reset();
    }
  }

  _getAverageFitness() {
    return this.population.reduce(
      (average, individual, _, population) =>
        average + individual.fitness / population.length,
      0
    );
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

    const parents = Selection.selection(
      this.population,
      this.numParents,
      this.selection
    );

    const children = Array(this.popSize - elites.length)
      .fill(null)
      .map(() => {
        const parentOne = parents[randBetween(0, parents.length)];
        const parentTwo = parents[randBetween(0, parents.length)];

        const child = Mutate.mutate(
          Crossover.crossover(parentOne, parentTwo, this.crossover),
          this.mutationRate
        );

        return child;
      });

    this.currentGeneration += 1;

    this.history = this.history.concat(this.population);
    this.population = [...elites, ...children];
  }

  _getState() {
    const userState = this.getState();
    return {
      ...userState,
      population: this.population,
      currentGeneration: this.currentGeneration,
      top: this.top,
      averageFitness: this.averageFitness,
      maxGenerations: this.maxGenerations,
      popSize: this.popSize,
      history: this.history,
    };
  }

  // Optional Override
  init() {}

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

  calculateFitness(individual, data) {
    throw new Error('method `calculateFitness` must be implemented');
  }

  shouldFinish(top) {
    throw new Error('method `shouldFinish` must be implemented');
  }
}

export default Simulation;
