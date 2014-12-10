var GameObject = require('../entities/gameobject')
var CONSTANTS = require('../constants')
var Vector2D = require('../vector')
var b2d = require('box2d')

Particle.prototype = new GameObject();
Particle.prototype.constructor = Particle;

function Particle(eid, x, y, m, r) {
	GameObject.prototype.constructor.call(this, eid);
    var props = b2d.b2CircleDef();
    props.radius = r || CONSTANTS.EPSILON;
    props.density = m /(Math.PI * props.radius^2);
    props.restitution = 1.0;
    props.friction = 0;
    var body_def = new b2d.b2BodyDef();
    body_def.AddShape(props);
    body_def.position.Set(x,y);

    this.body = brain.add_body(eid, body_def);
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
