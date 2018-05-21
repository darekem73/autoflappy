var backdrop;
var tune;
var terrain;
var birds = [];
var population;

var terrain_parameters = {
  speed: 3,
  acceleration: 1e-4,
};

var flappy_parameters = {
  gravity: 0.3,
  maxspeed: 10,
  maxthrust: 10,
  decision_threshold: 0.5,
};

var population_parameters = {
  num_creatures: 500,
  mutation_rate: 0.6,
  mutation_range: 2,
  ellitism: 0.1,
  random_behaviour: 0.0,
  num_parents: 2,
  num_children: 1,
};

function preload() {
  backdrop = new Backdrop();
  backdrop.init();
  backdrop.randomize();
  soundFormats('mp3', 'ogg');
  tune = loadSound('assets/muza.mp3');
}

function setup() {
  createCanvas(800, 600);

  terrain = new Terrain(terrain_parameters);
  terrain.init();

  population = new Population(population_parameters);

  for (var i = 0; i < population_parameters.num_creatures; i++) {
    var flappy = createBird();
    birds.push(flappy);
  }
  tune.setVolume(0.1);
  tune.play();
}


function draw() {
  background(230);
  if (!tune.isPlaying()) {
    tune.play()
  }

  backdrop.draw();

  terrain.update();
  terrain.draw();

  var all_dead = true;
  birds.forEach(function(b) {
    all_dead = all_dead && b.dead;
    if (!b.dead) {
      var inputs = b.look(terrain.getNextTarget(b.pos));
      var outputs = b.think(inputs);
      b.jump(outputs);
      b.update();
      b.draw();
      b.dead = terrain.crashed(b.aabb());
    }
  });

  if (all_dead) {
    population.init();
    birds.forEach(function(b) {
      var brain = b.getBrain();
      var genome = {
        brain: brain.toJSON(),
        score: b.getScore(),
      }
      population.add(genome);
    });
    population.generateNew(createBird);

    birds = [];
    population.genes.forEach(function(g) {
      var flappy = createBird();
      flappy.setBrain(synaptic.Network.fromJSON(g.brain));
      birds.push(flappy);
    });

    terrain.init();
    backdrop.randomize();
  }
  population.report();
  terrain.report();
}
