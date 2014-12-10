var K = 10;				// Spring constant
var NUM_NODES = 3;		// Number of nodes

Tether.prototype = new GameObject();
Tether.prototype.constructor = Tether;

function Tether(endpoint1, endpoint2) {
	GameObject.prototype.constructor.call(this);

  this.endpoint1 = endpoint1;
  this.endpoint2 = endpoint2;
	this.nodes = []

	var dx = Math.abs(x2 - x1);
	var dy = Math.abs(y2 - y1);
	var ddx = dx/(NUM_NODES-1);
	var ddy = dy/(NUM_NODES-1);

	for (var i = 0; i < NUM_NODES; ++i) {
		this.nodes.push(new Particle(x1 + ddx*i, y1 + ddy*i));
	}
}
