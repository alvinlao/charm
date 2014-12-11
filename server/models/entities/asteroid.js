var CONSTANTS = require('../../constants')
var Particle = require('../entities/particle');
var b2d = require("box2d");

Asteroid.prototype = Object.create(Particle.prototype);
Asteroid.prototype.constructor = Asteroid;

function Asteroid(world, eid, x, y, r, active) {
    this.active = active;
    this.team_id = null;
    var params = {
        density: CONSTANTS.ASTEROID_DENSITY,
        restitution: CONSTANTS.ASTEROID_RESTITUTION,
        friction: CONSTANTS.ASTEROID_FRICTION,
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
        active: this.active,
        team: this.team_id,
        velocity: this.get_velocity()

	}
}

module.exports = Asteroid;

