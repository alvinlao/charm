var GameObject = require('../entities/gameobject')
var CONSTANTS = require('../../constants')
var Particle = require('../entities/particle')
var b2d = require('box2d');

Tether.prototype = Object.create(GameObject.prototype);
Tether.prototype.constructor = Tether;

function Tether(world, eids, body1, body2, team_id) {
	GameObject.prototype.constructor.call(this);

	this.body1 = body1;
	this.body2 = body2;

    var revolute_joint = new b2d.b2RevoluteJointDef();
    link = this.body1.body;
    var v = this.body1.get_position().Copy(),
        x = v.x,
        y = v.y;
    v.Subtract(this.body2.get_position());
    var d = v.Length()/(2 * 10);
    console.log(v);
    console.log(this.body1.get_position());
    console.log(this.body2.get_position());
    console.log(d);
    console.log(x); console.log(y);
    // rope
    for (var i = 1; i <= 10; i++) {
        // rope segment
        var bodyDef = new b2d.b2BodyDef();
        bodyDef.position.x = x + (2 * i - 1) * d;
        bodyDef.position.y = y;
        console.log("x: " + bodyDef.position.x + " y: " + bodyDef.position.y);
        bodyDef.userData = { eid:(-10*i) };
        boxDef = new b2d.b2PolygonDef();
        boxDef.SetAsBox(d, 0.1);
        boxDef.density = 1;
        boxDef.friction = 0.5;
        boxDef.restitution = 0.2;
        body = world.CreateBody(bodyDef);
        body.CreateShape(boxDef);
        // joint
        revolute_joint.Initialize(link, body, new b2d.b2Vec2(x + 2 * (i - 1) * d, y));
        world.CreateJoint(revolute_joint);
        body.SetMassFromShapes();
        // saving the reference of the last placed link
        link = body;
    }
    console.log(this.body2.get_position());
    // final body
    revolute_joint.Initialize(link, this.body2.body, new b2d.b2Vec2(this.body2.get_position().x - d, y));
    world.CreateJoint(revolute_joint);
    body.SetMassFromShapes();
    return this;
}

Tether.prototype.sync = function() {
    console.log("Tether is syncing!");
}

//Create standard boxes of given height , width at x,y
function createBox(world, x, y, width, height, mass, options)
{
    var body_def = new b2d.b2BodyDef();
    body_def.position.Set(x , y);
    options.particle_type = CONSTANTS.TYPE_TETHER_NODE;
    body_def.userData = options;
    body_def.massData.mass = mass;

    var polygon_def = new b2d.b2PolygonDef();
    polygon_def.restitution = 0.2;
    polygon_def.density=100;
    polygon_def.friction=0.5;
    polygon_def.restitution=0.2;
    polygon_def.SetAsBox(width/2, height/2);

    var b = world.CreateBody(body_def);
    var f = b.CreateShape(polygon_def);
    b.SetMassFromShapes();
    return b;
}

module.exports = Tether;
