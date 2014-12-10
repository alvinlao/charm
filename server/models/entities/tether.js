var GameObject = require('../entities/gameobject');

Tether.prototype = new GameObject();
Tether.prototype.constructor = Tether;

function Tether(particle1, particle2) {
	GameObject.prototype.constructor.call(this);

	this.particle1 = particle1;
	this.particle2 = particle2;
	this.nodes = [];

	var dx = Math.abs(particle2.x - particle1.x),
	dy = Math.abs(particle2.y - particle1.y),
	ddx = dx/(NUM_NODES-1),
	ddy = dy/(NUM_NODES-1);

	for (var i = 0; i < NUM_NODES; ++i) {
		this.nodes.push(new ElasticParticle(particle1.x + ddx*i, particle1.y + ddy*i, K));
	}
}

Tether.prototype.update = function() {
	this.nodes[0].hookesLaw(this.nodes[i + 1]);

	for (var i = 1; i < NUM_NODES - 1; ++i) {
		this.nodes[i].hookesLaw(this.nodes[i - 1]);
		this.nodes[i].hookesLaw(this.nodes[i + 1]);
	}

	this.nodes[NUM_NODES - 1].hookesLaw(this.nodes[NUM_NODES - 2]);

	for (var i = 0; i < NUM_NODES; ++i) this.nodes[i].update();
}

module.exports = Tether;