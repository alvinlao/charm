var CONSTANTS = require('../../constants')
var Particle = require('../entities/Particle');
var b2d = require("box2d");

Asteroid.prototype = Object.create(Particle.prototype);
Asteroid.prototype.constructor = Asteroid;

function Asteroid(world, eid, x, y, r, active) {
    this.active = active;
    this.particle_type = CONSTANTS.TYPE_ASTEROID;
    var params = {
        density: 12,
        restitution: 0.5,
        friction: 0.9
    };
	Particle.prototype.constructor.call(this, world, eid, x, y, CONSTANTS.ASTEROID_MASS, r, params, CONSTANTS.TYPE_ASTEROID);
    var velocity_vector = new b2d.b2Vec2(Math.random()*10, Math.random()*10);
    this.body.SetLinearVelocity(velocity_vector);
    this.r = r;
    return this;
}


Asteroid.prototype.serialize = function () {
    var pos = this.get_position();
	return {
		entity_type: "Asteroid",
		x : pos.x,
		y : pos.y,
        r : this.r,
        active: this.active

	}
}

module.exports = Asteroid;

