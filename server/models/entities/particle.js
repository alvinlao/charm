var GameObject = require('../entities/gameobject')
var CONSTANTS = require('../constants')
var b2d = require('box2d')

Particle.prototype = new GameObject();
Particle.prototype.constructor = Particle;

function Particle(world, eid, x, y, m, r) {
	GameObject.prototype.constructor.call(this, eid);
    var props = new b2d.b2CircleDef();
    props.radius = r || CONSTANTS.EPSILON;
    props.density = m /(Math.PI * props.radius^2);
    props.restitution = 1.0;
    props.friction = 0;
    var body_def = new b2d.b2BodyDef();
    body_def.AddShape(props);
    body_def.position.Set(x,y);

    this.body = world.CreateBody(eid, body_def);
    return this;
}

Particle.prototype.get_position = function() {
    return this.body.m_position.Copy();
}

/* apply_force :: force : Vec2
 */
Particle.prototype.apply_force = function(force) {
    this.body.ApplyForce(force);
    return this;
}

Particle.prototype.serialize = function () {
  console.log("particle serialize called");
}

module.exports = Particle;
