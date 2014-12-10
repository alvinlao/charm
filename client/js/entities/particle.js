Particle.prototype = new GameObject();
Particle.prototype.constructor = Particle;

function Particle(x, y, m, r) {
	GameObject.prototype.constructor.call(this);

	this.x = x;
	this.y = y;
	this.m = m;
	this.r = r || 0;

	// Vectors
	this.V = [];	// velocity
	this.F = [];	// force
}

/*
	Check collision with another particle
 */
Particle.prototype.intersects = function(other) {
	// TODO
}

/*
	Apply collision logic to this particle
	@other: Particle
 */
Particle.prototype.collide = function(other) {

}