var dark_stars = ["#117ffc", "#e9feff", "#e9feff", "#e9feff", "#e9feff", "#506c9c", "#9fc3d3", "#7173ac"]
var dark_dust = ["assets/dust_2.png", "assets/dust_3.png"];
var dark_planet = ["assets/planet_2.png", "assets/planet_3.png", "assets/planet_4.png", "assets/planet_6.png"];
var dark_nebula = ["assets/nebula_1.png"];

var bright_stars = ["#e9feff", "#e9feff", "#e9feff", "#e9feff", "#edf800", "#ff7f1d", "#fd0408", "#fd0408", "#edf800"]
var bright_dust = ["assets/dust_1.png"];
var bright_planet = ["assets/planet_1.png", "assets/planet_5.png", "assets/planet_6.png"];
var bright_nebula = ["assets/nebula_2.png"];


function World() {
    this.stars = [];
    this.objects = [];
}

World.prototype.init = function() {
    // Choose light or dark environment
    if(Math.random() > 0.33) {
        // Generate stars
        for (var i=0; i<200; i++) {
            this.stars.push(canvas.display.ellipse({x: canvas.width*Math.random(), y: canvas.height*Math.random(), radius:0.5+1.5*Math.random(), fill:dark_stars[Math.floor(Math.random()*dark_stars.length)]}).add());
        }

        // Generate celestial objects. (Only 3)
        this.objects.push(canvas.display.image({x:canvas.width/4 + canvas.height/2*Math.random(), y:canvas.height/4 + canvas.height/2*Math.random(), origin: { x: "center", y: "center" }, image: dark_nebula[Math.floor(Math.random()*dark_nebula.length)]}).add());
        this.objects.push(canvas.display.image({x:canvas.width/4 + canvas.height/2*Math.random(), y:canvas.height/4 + canvas.height/2*Math.random(), origin: { x: "center", y: "center" }, image: dark_planet[Math.floor(Math.random()*dark_planet.length)]}).add());
        for (var i=0; i<2; i++) {
            this.objects.push(canvas.display.image({x:canvas.width/4 + canvas.height/2*Math.random(), y:canvas.height/4 + canvas.height/2*Math.random(), origin: { x: "center", y: "center" }, image: dark_dust[Math.floor(Math.random()*dark_dust.length)]}).add());
        }
    } else {
        // Generate stars
        for (var i=0; i<200; i++) {
            this.stars.push(canvas.display.ellipse({x: canvas.width*Math.random(), y: canvas.height*Math.random(), radius:0.4+1.2*Math.random(), fill:bright_stars[Math.floor(Math.random()*bright_stars.length)]}).add());
        }

        // Generate celestial objects. (Only 3)
        this.objects.push(canvas.display.image({x:canvas.width/4 + canvas.height/2*Math.random(), y:canvas.height/4 + canvas.height/2*Math.random(), origin: { x: "center", y: "center" }, image: bright_nebula[Math.floor(Math.random()*bright_nebula.length)]}).add());
        this.objects.push(canvas.display.image({x:canvas.width/4 + canvas.height/2*Math.random(), y:canvas.height/4 + canvas.height/2*Math.random(), origin: { x: "center", y: "center" }, image: bright_planet[Math.floor(Math.random()*bright_planet.length)]}).add());
        for (var i=0; i<2; i++) {
            this.objects.push(canvas.display.image({x:canvas.width/4 + canvas.height/2*Math.random(), y:canvas.height/4 + canvas.height/2*Math.random(), origin: { x: "center", y: "center" }, image: bright_dust[Math.floor(Math.random()*bright_dust.length)]}).add());
        }
    }
}

World.prototype.clear = function() {
    this.stars.forEach(function(star) {
        star.remove();
    });

    while(this.stars.length > 0) {
        this.stars.pop();
    }

    this.objects.forEach(function(object) {
        object.remove();
    });
    
    while(this.objects.length > 0) {
        this.objects.pop();
    }
}

World.prototype.draw = function() {

}