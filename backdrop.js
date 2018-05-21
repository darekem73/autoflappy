function Backdrop() {
  this.backdrops = [];
  this.current;

  this.init = function() {
    // load images to array
    // list of images can be given statically
    for (var i = 0; i < 10; i++) {
      var name = i + '.jpg';
      var img = loadImage("assets/" + name);
      this.backdrops.push(img);
    }
    this.randomize();
  };
  this.randomize = function() {
    // select random image from array
    this.current = random(this.backdrops);
  };
  this.draw = function() {
    // display image on canvas
    drawingContext.globalAlpha = 0.5;
    image(this.current, 0, 0);
    drawingContext.globalAlpha = 1;
  };
}
