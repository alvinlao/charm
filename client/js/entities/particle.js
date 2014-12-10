Particle.prototype = new GameObject();
Particle.prototype.constructor = Particle;

function Particle(eid, x, y) {
	this.x = x;
	this.y = y;

	GameObject.prototype.constructor.call(this, eid);
}
