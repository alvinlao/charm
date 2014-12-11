var Particle = require('../entities/Particle');

Asteroid.prototype = Object.create(Particle.prototype);
Asteroid.prototype.constructor = Asteroid;

function Asteroid(world, eid, x, y) {
    this.active = false;
	Particle.prototype.constructor.call(this, world, eid, x, y, 10);
    return this;
}


Asteroid.prototype.serialize = function () {
    var pos = this.get_position();
	return {
		entity_type: "Asteroid",
		x : pos.x,
		y : pos.y,
        active: this.active

	}
}

module.exports = Asteroid;

