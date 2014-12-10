Particle.prototype = new GameObject();
Particle.prototype.constructor = Particle;

function Particle(x, y) {
	GameObject.prototype.constructor.call(this);

	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;

	// Upcoming forces
	this.F = [];
}