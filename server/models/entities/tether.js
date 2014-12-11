var GameObject = require('../entities/gameobject')
var CONSTANTS = require('../constants')
var Particle = require('../entities/particle')
var b2d = require('box2d');

Tether.prototype = new GameObject();
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
        var internal_node = Particle(world, -1, u.x, u.y, CONSTANTS.TETHER_NODE_MASS, CONSTANTS.TETHER_NODE_RADIUS);
        this.internal_nodes.push(internal_node);
    }

    // Model links with joints
    var rjd1 = b2d.b2RevoluteJointDef();
    rjd1.anchorPoint(this.body1.get_position());
    rjd1.body1 = this.body1;
    rjd1.body2 = this.internal_nodes[0];
    this.joints.push(world.CreateJoint(b2d.b2RevoluteJoint(rjd1)));
    for(var i = 0; i < CONSTANTS.TETHER_NUM_NODES - 1; i++){
        var rjd = b2d.b2RevoluteJointDef(),
            a = this.internal_nodes[i],
            b = this.internal_nodes[i+1];
        rjd.anchorPoint(a.get_position());
        rjd.body1 = a;
        rjd.body2 = b;
        this.joints.append(world.CreateJoint(b2d.b2RevoluteJoint(rjd)));
    }
    var rjd2 = b2d.b2RevoluteJointDef(),
        last_internal_node = this.internal_nodes[CONSTANTS.TETHER_NUM_NODES - 1];
    rjd2.anchorPoint(last_internal_node.get_position());
    rjd2.body1 = last_internal_node;
    rjd2.body2 = this.body2;
    this.joints.push(world.CreateJoint(b2d.b2RevoluteJoint(rjd2)));
}

module.exports = Tether;
