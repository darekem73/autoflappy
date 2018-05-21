function Obstacle(x) {
  this.x = x;
  this.w = 30;
  this.h = random(height / 4, 3 * height / 4);
  this.gap = random(height / 4, height / 3);

  this.target = function() {
    return [this.x + this.w, this.h + this.gap / 2];
  };
  this.clearBox = function() { //zdecydowane ulepszenie
    var cb = {
      tl: createVector(this.x, this.h),
      br: createVector(this.x + this.w, this.h + this.gap),
    };
    return [cb.tl.x, cb.tl.y, cb.br.x, cb.br.y];
  };
  this.crashed = function(tl, br) {
    var cb = this.clearBox();
    var clear = {
      tl: createVector(cb[0], cb[1]),
      br: createVector(cb[2], cb[3]),
    };
    var flappySafe =
      (tl.y > clear.tl.y && br.y < clear.br.y) ||
      (br.x < clear.tl.x || tl.x > clear.br.x)
    return !flappySafe;
  };
  this.visible = function() {
    return this.x + this.w > 0;
  };
  this.update = function(s) {
    this.x -= s;
  };
  this.draw = function() {
    fill('green');
    stroke('black');
    strokeWeight(0.3);
    rect(this.x, 0, this.w, this.h);
    fill('brown');
    stroke('black');
    strokeWeight(0.3);
    rect(this.x, this.h + this.gap, this.w, height - (this.h + this.gap));
  };
}

function Terrain(parameters) {
  this.maxnum = 10;
  this.initspeed = parameters.speed;
  this.speed = this.initspeed;
  this.acceleration = parameters.acceleration;
  this.obstacles = [];
  this.count = 0;

  this.getNextTarget = function(position) {
    var target, clearBox;
    for (var i = 0; i < this.obstacles.length; i++) {
      var o = this.obstacles[i];
      var t = o.target();
      target = createVector(t[0], t[1]);
      if (target.x > position.x) {
        var cb = o.clearBox();
        clearBox = {
          tl: createVector(cb[0], cb[1]),
          br: createVector(cb[2], cb[3]),
        };
        break;
      }
    }
    return [target.x, target.y, clearBox.tl.x, clearBox.tl.y, clearBox.br.x - o.w, clearBox.br.y];
  };
  this.crashed = function(aabb) {
    var tl = createVector(aabb[0], aabb[1]);
    var br = createVector(aabb[2], aabb[3]);
    if (tl.y < 0 || br.y > height) {
      return true;
    }
    for (var i = 0; i < this.obstacles.length; i++) {
      var o = this.obstacles[i];
      if (o.crashed(tl, br)) {
        return true;
      }
    }
    return false;
  };
  this.newObstacle = function() {
    var last = this.obstacles[this.obstacles.length - 1];
    var x = last.x + random(width / 3, 2 * width / 3);
    this.obstacles.push(new Obstacle(x));
  };
  this.init = function() {
    this.speed = this.initspeed;
    this.count = 0;
    this.obstacles = [];
    var x = width + 10;
    for (var i = 0; i < this.maxnum; i++) {
      this.obstacles.push(new Obstacle(x));
      x += random(width / 3, 2 * width / 3);
    }
  };

  this.report = function() {
    fill(0);
    noStroke();
    text(this.count, width - 30, 15);
    text(this.speed, width - 30, 30);
    text(frameRate().toFixed(0), width - 30, 45);
  };
  this.update = function() {;
    for (var i = this.obstacles.length - 1; i >= 0; i--) {
      o = this.obstacles[i];
      o.update(this.speed);
      if (!o.visible()) {
        this.count++;
        this.obstacles.splice(i, 1);
        this.newObstacle();
      }
    }
    this.speed *= (1 + this.acceleration);
  };
  this.draw = function() {
    this.obstacles.forEach(function(o) {
      o.draw();
    });
  };
}
