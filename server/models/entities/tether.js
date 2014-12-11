var GameObject = require('../entities/gameobject')
var CONSTANTS = require('../../constants')
var Particle = require('../entities/particle')
var b2d = require('box2d');

Tether.prototype = Object.create(GameObject.prototype);
Tether.prototype.constructor = Tether;

function Tether(world, eids, body1, body2) {
	GameObject.prototype.constructor.call(this);

	this.body1 = body1;
	this.body2 = body2;
    this.internal_nodes = [];
    this.joints = [];

    // Create internal nodes for rope
    var dv = this.body2.get_position().Copy();
    dv.Subtract(this.body1.get_position());
    var dist = dv.Length();
    dv.Normalize();
    dv.Multiply(dist/(CONSTANTS.TETHER_NUM_NODES + 1));

    var RADIUS = 0.8 * (dist / CONSTANTS.TETHER_NUM_NODES);
    for(var i = 0; i < CONSTANTS.TETHER_NUM_NODES; i++) {
        var u = this.body1.get_position().Copy();
        var v = dv.Copy();
        v.Multiply(i + 1);
        u.Add(v);
        var internal_node = new Particle(world, eids[i], u.x, u.y, CONSTANTS.TETHER_NODE_MASS, RADIUS);
        this.internal_nodes.push(internal_node);
    }

    // Model links with joints
    var rjd1 = new b2d.b2RevoluteJointDef(),
        first_node = this.internal_nodes[0]
        dv = this.body1.get_position().Copy();
    dv.Subtract(first_node.get_position());
    dv.Multiply(0.5);
    var anchor = this.body1.get_position().Copy();
    rjd1.Initialize(this.body1.body, this.internal_nodes[0].body, anchor);
    this.joints.push(world.CreateJoint(rjd1));
    for(var i = 0; i < CONSTANTS.TETHER_NUM_NODES - 1; i++){
        var rjd = new b2d.b2RevoluteJointDef(),
            a = this.internal_nodes[i],
            b = this.internal_nodes[i+1];
        var dv = a.get_position().Copy();
        dv.Subtract(b.get_position());
        dv.Multiply(0.5);
        var anchor = a.get_position().Copy();
        anchor.Add(dv);
        rjd.Initialize(a.body, b.body, anchor);
        this.joints.push(world.CreateJoint(rjd));
    }
    var rjd2 = new b2d.b2RevoluteJointDef(),
        last_node = this.internal_nodes[CONSTANTS.TETHER_NUM_NODES - 1],
        dv = last_node.get_position().Copy();
    dv.Subtract(this.body2.get_position());
    dv.Multiply(0.5);
    var anchor = last_node.get_position().Copy();
    anchor.Add(dv);
    rjd2.Initialize(last_node.body, this.body2.body, anchor);
    this.joints.push(world.CreateJoint(rjd2));
}

Tether.prototype.sync = function() {
    console.log("Tether is syncing!");
}

module.exports = Tether;
