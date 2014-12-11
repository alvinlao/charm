Particle.prototype = Object.create(GameObject.prototype);
Particle.prototype.constructor = Particle;

function Particle(eid, state) {
	this.x = state.x;
	this.y = state.y;

	GameObject.prototype.constructor.call(this, eid, state);
}
