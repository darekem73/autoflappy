function randomClamped(n) {
  return random(-n, n);
}

function compareGenomes(g1, g2) {
  return g2.score - g1.score;
}

function Population(parameters) {
  this.genes = [];
  this.generation = 0;
  this.avgfitness = 0;
  this.maxfitness = 0;
  this.absmaxfitness = 0;
  this.score = 0;
  this.num_creatures = parameters.num_creatures;
  this.mutation_rate = parameters.mutation_rate;
  this.mutation_range = parameters.mutation_range;
  this.ellitism = parameters.ellitism;
  this.random_behaviour = parameters.random_behaviour;
  this.num_parents = parameters.num_parents;
  this.num_children = parameters.num_children;

  this.init = function() {
    this.genes = [];
    this.avgfitness = 0;
    this.maxfitness = 0;
    this.score = 0;
  };
  this.add = function(genome) {
    this.genes.push(genome);
    this.score += genome.score;
    if (genome.score > this.maxfitness) {
      this.maxfitness = genome.score;
    }
    if (genome.score > this.absmaxfitness) {
      this.absmaxfitness = genome.score;
    }
  };
  this.generateNew = function(new_creature) {
    this.genes.sort(compareGenomes);
    this.avgfitness = this.score / this.genes.length;

    var new_population = [];
    var e = floor(this.ellitism * this.genes.length);
    var rb = floor(this.random_behaviour * this.genes.length);
    // ellitism
    for (var i = 0; i < e; i++) {
      var genome = this.genes[i];
      genome.score = 0;
      new_population.push(genome);
    }
    // random behaviour
    for (var j = 0; j < rb; j++) {
      var b = new_creature();
      var brain = b.getBrain();
      var genome = {
        brain: brain.toJSON(),
        score: 0,
      };
      new_population.push(genome);
    };
    // breed
    while (new_population.length < this.num_creatures) {
      var parents = [];
      // choose parents
      var index = 0;
      var failSafe = 10000;
      for (var j = 0; j < this.num_parents; j++) {
        do {
          index = floor(random(this.genes.length));
          failSafe--;
        } while (random() > this.genes[index].score / this.maxfitness && failSafe >= 0);
        if (failSafe < 0) {
          console.log('oops; unable to find parent');
          index = 0; //choosing the fittest
        }
        parents.push(this.genes[index]);
      }
      for (var i = 0; i < this.num_children; i++) {
        if (new_population.length < this.num_creatures) {
          // create offspring
          var b = new_creature();
          var brain = b.getBrain().toJSON();
          // crossover
          for (var j = 0; j < brain.connections.length; j++) {
            var index = floor(random() * this.num_parents);
            brain.connections[j].weight = parents[index].brain.connections[j].weight;
          }
          for (var j = 0; j < brain.neurons.length; j++) {
            var index = floor(random() * this.num_parents);
            brain.neurons[j].bias = parents[index].brain.neurons[j].bias;
          }
          var genome = {
            brain: brain,
            score: 0,
          };
          // mutate genome
          for (var i = 0; i < genome.brain.connections.length; i++) {
            var c = genome.brain.connections[i];
            if (random() < this.mutation_rate) {
              c.weight += randomClamped(this.mutation_range);
            }
          }
          for (var i = 0; i < genome.brain.neurons.length; i++) {
            var n = genome.brain.neurons[i];
            if (n.layer != 'input') {
              if (random() < this.mutation_rate) {
                n.bias += randomClamped(this.mutation_range);
              }
            }
          }
          new_population.push(genome);
        }
      }
    }
    this.genes = new_population;
    this.generation++;
  };
  this.report = function() {
    noStroke();
    fill('black');
    textSize(10);
    text('GEN    : ' + this.generation, 15, 15);
    text('fitness: ' + this.avgfitness.toExponential(2), 15, 30);
    text('max_fit: ' + this.maxfitness.toExponential(2), 15, 45);
    text('record : ' + this.absmaxfitness.toExponential(2), 15, 60);
    text('pool   : ' + this.genes.length, 15, 75);

    // console.log('gen: ' + this.generation + ', fit: ' + this.avgfitness.toExponential(2) + ', max: ' + this.maxfitness.toExponential(2) + ', rekord: ' + this.absmaxfitness.toExponential(2));
  };
}
