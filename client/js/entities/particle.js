Particle.prototype = new GameObject();
Particle.prototype.constructor = Particle;

function Particle(eid, x, y) {
	GameObject.prototype.constructor.call(this, eid);

	this.x = x;
	this.y = y;
}
