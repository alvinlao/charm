var K = 10;				// Spring constant
var NUM_NODES = 10;		// Number of nodes

Tether.prototype = new Particle();
Tether.prototype.constructor = Tether;

function Tether(x, y) {
	Particle.prototype.constructor.call(this, x, y)
	this.neighbor = 2;
}