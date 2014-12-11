var GameObject = require('../entities/gameobject')
var CONSTANTS = require('../constants')
var b2d = require('box2d')

Particle.prototype = Object.create(GameObject.prototype);
Particle.prototype.constructor = Particle;

function Particle(world, eid, x, y, m, r) {
	GameObject.prototype.constructor.call(this, eid);
    var props = new b2d.b2CircleDef();
    props.radius = r || CONSTANTS.EPSILON;
    props.density = m /(Math.PI * props.radius^2);
    props.restitution = 1.0;
    props.friction = 0;
    var body_def = new b2d.b2BodyDef(props);
    body_def.userData = {circleShape: props, eid: eid};
    body_def.position.Set(x,y);

    // Mass
    var mass_data = body_def.massData;
    mass_data.mass = m;
    mass_data.I = m;
    mass_data.center = new b2d.b2Vec2(x, y);

    this.body = world.CreateBody(body_def);
    return this;
}

Particle.prototype.get_position = function() {
    return this.body.GetPosition();
}

Particle.prototype.apply_force = function(force) {
    this.body.ApplyForce(force, this.body.GetPosition());
    return this;
}

Particle.prototype.serialize = function () {
  console.log("particle serialize called");
}

Particle.prototype.sync = function(body) {
    this.body = body;
    this.x = this.get_position().x;
    this.y = this.get_position().y;
}

module.exports = Particle;
