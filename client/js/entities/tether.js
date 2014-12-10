var K = 10;				// Spring constant
var NUM_NODES = 3;		// Number of nodes

Tether.prototype = new GameObject();
Tether.prototype.constructor = Tether;

function Tether(particle1, particle2) {
	GameObject.prototype.constructor.call(this);

  this.particle1 = particle1;
  this.particle2 = particle2;
	this.nodes = []

	var dx = Math.abs(particle2.x - particle1.x),
	    dy = Math.abs(particle2.y - particle1.y),
	    ddx = dx/(NUM_NODES-1),
	    ddy = dy/(NUM_NODES-1);

	for (var i = 0; i < NUM_NODES; ++i) {
		this.nodes.push(new Particle(x1 + ddx*i, y1 + ddy*i));
	}
}
