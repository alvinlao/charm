Particle.prototype = new GameObject();
Particle.prototype.constructor = Particle;

function Particle(x, y, m, r) {
	GameObject.prototype.constructor.call(this);

	this.x = x;
	this.y = y;
	this.m = m;
	this.r = r || 0;

	// Vectors
	this.V = Vector2D(0,0);	// velocity
	this.F = Vector2D(0,0);	// force
}

/*
	Check collision with another particle
 */
Particle.prototype.intersects = function(other) {
  var dest = Math.sqrt((this.x - other.x)^2 + (this.y - other.y)^2);
  return dist <= this.r = other.r;
}

Particle.prototype.applyForce = function() {
  this.V.add(this.F.scale(1/this.m));
  this.F = Vector2D(0,0);
}

Particle.prototype.update = function () {
  this.applyForce();
  this.x = this.V.x * this.dt;
  this.y = this.V.y * this.dt;
}

/*
	Apply collision logic to this particle
	@other: Particle
 */
Particle.prototype.collide = function(other) {

}
