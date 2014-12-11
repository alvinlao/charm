Asteroid.prototype = new Particle();
Asteroid.prototype.constructor = Asteroid;

function Asteroid(eid) {
	Particle.prototype.constructor.call(this, eid, 100, 100);

	this.dx = 0;
	this.dy = 0;
	this.rotation = 0;
}

Asteroid.prototype.init_draw = function() {
	this.drawable = canvas.display.ellipse({x: this.x, y: this.y, radius:10, fill:"white"}).add();
	this.drawable.strokeColor = "white";

//	this.trail = canvas.display.image({
//		x: this.x,
//		y: this.y+24,
//		origin: { x: "center", y: "center" },
//		image: "assets/Asteroid_ship_trail.png",
//		width: 37, height: 69}).add();

//	this.drawable = canvas.display.image({
//		x: this.x,
//		y: this.y,
//		origin: { x: "center", y: "center" },
//		image: "assets/Asteroid_ship.png",
//		width: 37, height: 43}).add();
}

Asteroid.prototype.draw = function() {
	Particle.prototype.draw.call(this);
	this.drawable.moveTo(this.x, this.y);
}

Asteroid.prototype.replicate = function(state) {

	this.x = state.x;
	this.y = state.y;

}

Asteroid.prototype.destroy = function() {
	this.drawable.remove();
}
