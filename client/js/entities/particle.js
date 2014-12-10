Particle.prototype = new GameObject();
Particle.prototype.constructor = Particle;

function Particle(x, y, m, r) {
	GameObject.prototype.constructor.call(this);

	this.x = x;
	this.y = y;
	this.m = m;
	this.r = r || 0;

	// Vectors
	this.V;			// velocity
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

Particle.prototype.calculate_velocity = function(other) {
	var v = new Vector(this.V.x, this.V.y);
	var u = new Vector(other.x, other.y);

	v.multiply(this.m);
	u.multiply(other.m);

	return v.add(u).divide(this.m + other.m);
}

Particle.prototype.calculate_force = function(V, dt) {
	this.V
}

// Particle.prototype.calculate_