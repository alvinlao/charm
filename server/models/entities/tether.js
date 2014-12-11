var GameObject = require('../entities/gameobject')
var CONSTANTS = require('../constants')
var Particle = require('../entities/particle')
var b2d = require('box2d');

Tether.prototype = Object.create(GameObject.prototype);
Tether.prototype.constructor = Tether;

function Tether(world, body1, body2) {
	GameObject.prototype.constructor.call(this);

	this.body1 = body1;
	this.body2 = body2;
    this.internal_nodes = [];
    this.joints = [];

    // Create internal nodes for rope
    var dv = this.body2.get_position();
    dv.Subtract(this.body1.get_position());
    dv.Multiply(dv.Length()/CONSTANTS.TETHER_NUM_NODES);
    for(var i = 0; i < CONSTANTS.TETHER_NUM_NODES; i++) {
        var u = this.body1.get_position();
        var v = dv.Copy();
        v.Multiply(i);
        u.Add(v);
        var internal_node = new Particle(world, -1, u.x, u.y, CONSTANTS.TETHER_NODE_MASS, CONSTANTS.TETHER_NODE_RADIUS);
        this.internal_nodes.push(internal_node);
    }

    // Model links with joints
    var rjd1 = new b2d.b2RevoluteJointDef();
    rjd1.Initialize(this.body1.body, this.internal_nodes[0].body, this.body1.get_position());
    this.joints.push(world.CreateJoint(rjd1));
    for(var i = 0; i < CONSTANTS.TETHER_NUM_NODES - 1; i++){
        var rjd = new b2d.b2RevoluteJointDef(),
            a = this.internal_nodes[i],
            b = this.internal_nodes[i+1];
        rjd.Initialize(a.body, b.body, a.get_position());
        this.joints.push(world.CreateJoint(rjd));
    }
    var rjd2 = new b2d.b2RevoluteJointDef(),
        last_internal_node = this.internal_nodes[CONSTANTS.TETHER_NUM_NODES - 1];
    rjd2.Initialize(last_internal_node.body, this.body2.body, last_internal_node.get_position());
    this.joints.push(world.CreateJoint(rjd2));
}

module.exports = Tether;
