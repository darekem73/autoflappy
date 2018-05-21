function createBird() {
  return new Bird(flappy_parameters);
}

function Bird(parameters) {
  this.gravity = createVector(0, parameters.gravity);
  this.vel = createVector(0, 0);
  this.pos = createVector(width / 5, height / 2);
  this.d = height / 25;
  this.r = this.d / 2;
  this.maxspeed = parameters.maxspeed;
  this.maxthrust = parameters.maxthrust;
  this.decision_threshold = parameters.decision_threshold;
  this.brain = new synaptic.Architect.Perceptron(3, 10, 1);
  this.life = 0;
  this.dead = false;

  this.setBrain = function(brain) {
    this.brain = brain;
  };
  this.getBrain = function() {
    return this.brain;
  };
  this.getScore = function() {
    return this.life;
  };
  this.look = function(target) {
    var t = createVector(target[0], target[1]);
    var gap = {
      top: createVector(target[2], target[3]),
      bottom: createVector(target[4], target[5]),
    }
    var aabb = {
      tl: createVector(this.pos.x - this.r, this.pos.y - this.r),
      br: createVector(this.pos.x + this.r, this.pos.y + this.r),
    }

    var v = p5.Vector.sub(t, this.pos);
    v.x = map(v.x, 0, width, 0, 1);
    v.y = map(v.y, -height, height, 0, 1);

    var tr = createVector(aabb.br.x, aabb.tl.y);
    var vt = p5.Vector.sub(gap.top, tr);
    vt.x = map(v.x, 0, width, 0, 1);
    vt.y = map(v.y, -height, height, 0, 1);

    var vb = p5.Vector.sub(gap.bottom, aabb.br);
    vb.x = map(v.x, 0, width, 0, 1);
    vb.y = map(v.y, -height, height, 0, 1);

    var vel = map(this.vel.y, -this.maxspeed, this.maxspeed, 0, 1);
    // return [v.x, v.y, vel];
    var fromTop = map(this.pos.y, 0, height, 0, 1);
    var fromBottom = map(height - this.pos.y, 0, height, 0, 1);
    //return [v.x, v.y, vt.x, vt.y, vb.x, vb.y, vel];
    return [v.x, v.y, vel];
  };
  this.think = function(inputs) {
    return this.brain.activate(inputs);
  };
  this.jump = function(decision) {
    if (decision[0] > this.decision_threshold) {
      this.vel.y -= this.maxthrust;
    }
  };
  this.aabb = function() {
    var tl = createVector(this.pos.x - this.r, this.pos.y - this.r);
    var br = createVector(this.pos.x + this.r, this.pos.y + this.r);
    return [tl.x, tl.y, br.x, br.y];
  };
  this.update = function() {
    this.vel.add(this.gravity);
    // this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.life++;
  };
  this.draw = function() {
    fill('orange');
    strokeWeight(0.3);
    stroke('black');
    ellipse(this.pos.x, this.pos.y, this.d);
  };
}
