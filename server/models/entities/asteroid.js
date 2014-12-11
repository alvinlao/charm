var CONSTANTS = require('../../constants')
var Particle = require('../entities/Particle');
var b2d = require("box2d");

Asteroid.prototype = Object.create(Particle.prototype);
Asteroid.prototype.constructor = Asteroid;

function Asteroid(world, eid, x, y) {
    this.active = false;
	Particle.prototype.constructor.call(this, world, eid, x, y, CONSTANTS.ASTEROID_MASS, CONSTANTS.ASTERIOD_RADIUS);
    var velocity_vector = new b2d.b2Vec2(Math.random()*10, Math.random()*10);
    this.body.SetLinearVelocity(velocity_vector);
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

