var ship_assets = ["assets/astroid_1.png", "assets/astroid_2.png", "assets/astroid_3.png", "assets/astroid_4.png"]

Asteroid.prototype = Object.create(Particle.prototype);
Asteroid.prototype.constructor = Asteroid;

function Asteroid(eid, state) {
	Particle.prototype.constructor.call(this, eid, state);

	this.dx = 0;
	this.dy = 0;
	this.rotation = 0;
}

Asteroid.prototype.init_draw = function() {
	this.drawable = canvas.display.image({
		x: this.x,
		y: this.y,
		origin: {x: "center", y: "center"},
		image: ship_assets[Math.floor(Math.random()*ship_assets.length)]
		}).add();

	this.drawable.rotateTo(Math.random()*360);
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
