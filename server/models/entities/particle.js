var GameObject = require('../entities/gameobject')
var CONSTANTS = require('../../constants')
var b2d = require('box2d')

Particle.prototype = Object.create(GameObject.prototype);
Particle.prototype.constructor = Particle;

function Particle(world, eid, x, y, m, r, params, particle_type) {
	GameObject.prototype.constructor.call(this, eid);

    var body_def = new b2d.b2BodyDef();
    body_def.userData = {eid: eid, particle_type:particle_type};
    body_def.position.Set(x,y);
    //body_def.massData.mass = m;

    this.body = world.CreateBody(body_def);
    this.body.m_linearDamping = CONSTANTS.PLAYER_FRICTION;

    var shape_def = new b2d.b2CircleDef();
    shape_def.radius = r || CONSTANTS.EPSILON;
    params = params || {};
    shape_def.density = params.density || 3;
    shape_def.restitution = params.restitution || 1;
    shape_def.friction = params.friction || 0.2;
    this.body.CreateShape(shape_def);
    this.body.SetMassFromShapes();
    return this;
}

Particle.prototype.get_position = function() {
    return this.body.GetPosition();
}

Particle.prototype.get_velocity = function() {
    return this.body.GetLinearVelocity();
}

Particle.prototype.apply_force = function(force) {
    this.body.ApplyForce(force, this.body.GetPosition());
    return this;
}

Particle.prototype.apply_brake = function() {
    this.body.SetLinearVelocity(new b2d.b2Vec2(0.0, 0.0));
    return this;
}

Particle.prototype.serialize = function () {
    var pos = this.get_position();
    return {
        entity_type: "particle",
        x : pos.x,
        y : pos.y,
        vx: this.v.x,
        vy: this.v.y
    }
}

Particle.prototype.sync = function(body) {
    this.body = body;
    this.x = this.get_position().x;
    this.y = this.get_position().y;
    this.v = this.get_velocity();
}

module.exports = Particle;
