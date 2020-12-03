# genie.js

**genie.js** is a highly flexible, data-agnostic, and UI-independent Genetic Algorithm library written in JavaScript by [Adrian Perea](https://twitter.com/adrianmarkperea).

## Why Genie.js?
Current implementations of GA in JavaScript either:
+ Make too many assumptions about your data (no flexibility)
+ Make too little assumptions about your data (too much flexibility)

Having too little flexibility limits the problems the library can solve. Having too much flexibility introduces more surface area for problems. An ideal API, then, is:
+ flexible enough so different data models can be accomodated
+ rigid enough that problems from different domains are abstracted and worked with

This is precisely the API **genie.js** offers. Now you can focus on only writing code that concerns your problem. Leave the rest to genie. 😉

Furthermore, genie doesn't make any assumptions about your UI. *Lifecycle Hooks* allow you to plug and play any UI that you choose.

## Installation

Simply install from npm:

```bash
npm install --save @adrianperea/genie.js
```

## Example Usage

Genie makes use of three primitive elements:
+ `Simulation`: responsible for running the GA loop
+ `Individual`: a container for Chromosomes (contains one or more)
+ `Chromosome`: a container for genes

Let's see how we can use these elements to build the quintessential GA example: the phrase guesser. Here, we'll let the algorithm guess the phrase: *to be or not to be*.
(Just want the code? You can see the full implementation in `/examples`!)

### 1) Do the necessary imports

```javascript
  const genie = require('@adrianperea/genie.js');
  const { Simulation, Individual, Chromosome } = genie;
```

### 2) Create a `Chromosome` instance.

A `Chromosome` needs a `length` and a `generate()` method. `length` determines how many genes the `Chromosome` has, and the `generate()` method determines how each gene is randomly generated. In our case, we want each gene to be a randomly generated lower-case letter. Our generate function is then:

```javascript
const generate = () => {
  const charset = 'abcdefghijklmnopqrstuvwxyz '; 
                                          // ^ don't forget that space!
  const randomChar = charset[Math.floor(Math.random() * charset.length)];
  return randomChar;
}
```
We then creat the Chromosome as follows:
```javascript
// define our target first
const target = 'to be or not to be'
const myChromosome = new Chromosome(target.length, generate);
                                 // ^^^^^^^^^^^^^ We want each of our chromosomes to
                                 //               be as long as our target

// We can also do it like this
const myChromome = new Chromosome(
  target.length,
  () => {
    const charset = 'abcdefghijklmnopqrstuvwxyz ';
    const randomChar = charset[Math.floor(Math.random() * charset.length)];
    return randomChar;
  }
)
```
This is our chromosome *prototype*. It doesn't have genes yet. But genie will use this to create lower letter characters (remember our generate function?) to produce genes with a length of 18 (`len('to be or not to be') === 18`).

If our Chromosome has a length of 4, we can expect genes to have the following form:

+ ['a', 'b', 'a', 'z']
+ ['t', 'w', 'v', 'm']

*Note: A Chromosome also accepts a third argument `mutate()`. By default, each gene that should undergo mutation will just call the `generate()` method. See: Override the Mutate Method below.*

### 3) Creating an Individual
An `Individual` is, at the minimum, a composition of one or more Chromosomes. Most use cases (like ours) only need one `Chromosome`:

```javascript
const individual = new Individual(myChromosome);
```

More complex use cases might require more than one chromosome, and for each of those chromosomes to perform *crossover* and *mutation* independently. Genie makes this simple. Just pass an array of `Chromosome`s to the individual. 

As a contrived example, say we wanted to guess two phrases:
```javascript
const individual = new Individual([myChromosome, myChromosome]);

// or alternatively
const individual = new Individual();
individual.addChromosome(myChromosome);
individual.addChromosome(myChromosome);
```

Each chromosome then behaves independently. Neat!

### 4) Creating the simulation

4) Extend the `Simulation` class. You can override many methods of a `Simulation`, but as the bare minimum, you need to override the `calculateFitness()` method. A common (but not necessary) override is `shouldFinish()`, which determines if our target condition has already been met. Let's see how we can use both of these:

```javascript
class PhraseGuesser extends Simulation {
  calculateFitness(individual, data) {
    const fitness = individual
      .getDna(0)
      .reduce(
        (current, gene, i) =>
          gene === data.target.charAt(i) ? current + 1 : current,
        0
      );

    return fitness / data.target.length;
  }

  shouldFinish(top) {
    return top.fitness === 1;
  }
}
```
Let's break down what's happening with `calculateFitness()`.
1. This method is called for each `Individual` in our population, and it's passed a reference to the current `Individual`, and custom `data` we pass our `Simulation`. In this case (as we will see later), we pass our `target`.
2. It calls the `Individual`'s `getDna()` method to get a reference to the Chromosome we passed it earlier (now with genes!). This returns the genes automatically, as an array of single lower letter characters of length 18. (e.g. `['a', 'b', 'c', ... , 'r']`). Since we only have one `Chromosome`, we call `getDna(0)`.
3. We call [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) and compare each gene with each character of the target. We add 1 if it matches, and 0 otherwise.
4. We then normalize the fitness by dividing it by the length of our target.

`shouldFinish()` is much simpler:
+ After each `Individual`'s fitness is calculated, this is called with the top individual (by default, the `Individual` with the highest fitness). 
+ If `true` is returned, the `Simulation` is finished. If `false`, generate a new population.
+ By default, always returns `false`, i.e., stop once we reach our generation limit.

### 5) Starting the Simulation
We first create a config object that we will pass to the `Simulation`. There are many options that you can pass here, but let's stick to the minimum:
```javascript
const config = {
  prototype: individual, // this will be the model of all other invidividuals in the population
  data: { target }, // custom data that's passed to calculateFitness()
}
```
Now, we can create and start our Phrase Guesser:
```javascript
const sim = new PhraseGuesser(config)
sim.start();
```
If you run the program now, it's going to run the algorithm in the background, but you won't be able to see anything.

At this point, our data layer is finished. Genie doesn't make any assumptions about your UI, so it provides a generic interface to get the data. 

Genie makes it simple to plug in your own UI implementation through lifecycle hooks: data change listeners that bubble up to the UI layer. We can implement our hooks by passing them in the configuration. There are a few hooks available, but for now let's use this `onCalculateFitness()` hook. Update your config object:
```javascript
const config = {
  prototype: individual,
  data: { target },
  onCalculateFitness(state) {
    console.log(state.top.fitness, state.top.getDna(0).join(''));
  },
}
```
Finally, run the simulation again:
```javascript
const sim = new PhraseGuesser(config)
sim.start();
```
It's working now! Great! You can view the full source code in `/examples`

*Note: You can learn more about the other config options and the lifecycle hooks below*.

## Config Options
The following canbe passed to `Simulation`. Note that only `prototype` is required, but most use cases should also include `data` and `onCalculateFitness`.
| Name | Data Type | Required | Description |
| ------------------ | ---------- | ----------- | ----------- |
| prototype          | Individual | Yes         | The model for all other Individual's in the population |
| data               | Any        | No (common) | Additional data for the simulation. Passed to calculateFitness() |
| popSize            | Int        | No          | The number of individuals in the population (default: 100) |
| maxGenerations     | Int        | No          | The number of generations to create (default: 1000) |
| numParents         | Int        | No          | The number of to consider for crossover (default: popSize) |
| selection          | Function   | No          | The function used for parent selection (default: Roulette Wheel Selection) |
| crossover          | Function   | No          | The function used for crossover (default: One Point Crossover) |
| mutationRate          | float   | No          | The rate of mutation (default: 0.01) |
| optimizer          | Function   | No          | The function used to determine which individual is "more fit" (default: Maximizer) |
| elitism            | Function   | No          | Flag for elitism. If true, the top N (= numParents) individuals will be retained for the next population  (default: false) |
| onInit             | Function   | No          | Lifecycle Hook. Called after the population is initiated. (default: null) |
| onUpdate           | Function   | No          | Lifecycle Hook. Called after the data model is updated. (default: null) |
| onCalculateFitness | Function   | No (common) | Lifecycle Hook. Called after the fitnesses of each individual have been calculated. (default: null) |
| onFinish           | Function   | No          | Lifecycle Hook. Called after the simulation is finished. (default: null) |

See *Genetic Operators* section below for other options for `selection`, `crossover`, and `optimizer`

## Lifecycle Hooks and State
Each lifecycle hook returns the `state` object. It has the follow keys:

| name | description |
| ---- | ----------- |
| population | a reference to the current population |
| currentGeneration | the current generation number |
| top | the top individual for the current generation |
| averageFitness | average fitness for all individuals |
| maxGenerations | the maximum generations specified in the config object |
| popSize | the population size specified in the config objectg |
| history | provides state information of previous generations |

Do you need custom state? See *Overridding Simulation Methods* section.

## Overriding Simulation Methods
| name | required | input | return | description |
| ---- | -------- | ----- | ------ | ----------- |
| calculateFitness | Yes | individual, data | number | Called with an individual and custom data passed to the config. Calculates the fitness of each individual. Return with the fitness value assigned to the individual.
| init | No | none | none | Instantiate custom data inside the class. Called after population is initialized. |
| getState | No | none | object | Define additional data to be returned when lifecycle methods are called. This gets combined with `state` |
| update | No | none | boolean (default: true) | Override to update your custom data model. Return `true` to signal that the data model is already updated and that the program should proceed to calculating fitnesses. Return `false` to call the update loop again.By default, just returns `true`. |
| reset |  No | none | none | Override to reset your custom data model. Called before a new generation is created and if the simulation is not yet finished. |
| shouldFinish | No | top | boolean (default: false) | Return `true` to terminate the simulation. Returns `false` by default, which makes the simulation run until max generations are reached. |

## Genetic Operators
### Selection Methods
| name | library reference | description |
| ---- | ----------------- | ----------- |
| Roulette Wheel Selection | genie.ga.Selection.rouletteWheel | Select each parent by simulating a spin of the roulette wheel with chances weighted by an Individual's fitness |
| Stochastic Universal Sampling | genie.ga.Selection.stochasticUniversalSampling | Similar to RouletteWheel selection, but provides evenly spaced points in which parents are selected. Allows lesser fit individuals to be chosen.

### Crossover Methods
| name | library reference | description |
| ---- | ----------------- | ----------- |
| One Point | genie.ga.Crossover.onepoint | Swaps genes between an individual point. First parent's genes are used first. |
| Two Point | genie.ga.Crossover.multipoint | Swaps genes between two different points. First parent's genes are used at the head and tail. | 
| Uniform | genie.ga.Crossover.uniform | 50-50% chance to select a gene from either parent for each gene. |

### Optimizers
| name | library reference | description |
| ---- | ----------------- | ----------- |
| Maximizer | genie.ga.Optimizer.maximizer | Individual's with higher fitness are "more fit". |
| Minimizer | genie.ga.Optimizer.minimizer | Individual's with lower fitness are "more fit". |

## Overriding Mutate
By default, mutate is called for each gene of a `Chromosome`.
In our example above, if we wanted to only mutate one gene per round, we can do the following:
```javascript
const generate = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyz ';
    const randomChar = charset[Math.floor(Math.random() * charset.length)];
    return randomChar;
};

const mutate = (genes, rate) => {
  if (Math.random() < rate) {
    const randomIndex = Math.floor(Math.random() * genes.length);
    return genes.map((gene, i) => i === randomIndex ? generate() : gene)
  }
}

const myChromosome = new Chromosome(
  target.length,
  generate,
  mutate,
)
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Author
**genie.js** was written by Adrian Perea.

[Follow](https://twitter.com/adrianmarkperea) me on Twitter!
You can also reach out to me on adrianmarkperea@gmail.com

## License
[MIT](https://choosealicense.com/licenses/mit/)
