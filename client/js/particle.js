function Particle(x, y) {
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;

	// Upcoming forces
	this.F = [];
}

Particle.prototype.getPosition = function() {
  return {x: this.x, y: this.y};
}
Particle.prototype.getVeloctiy = function() {
  return {vx: this.vx, vy: this.y};
}
