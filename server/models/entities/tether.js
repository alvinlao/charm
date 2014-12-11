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
    var v = this.body1.get_position(),
        x = v.x,
        y = v.y;
    v.Subtract(this.body2.get_position());
    var d = v.Length()/(2 * 10);
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
    revolute_joint.Initialize(link, this.body2.body, new b2d.b2Vec2(this.body2.get_position().x - d, this.body2.get_position().y));
    world.CreateJoint(revolute_joint);
    body.SetMassFromShapes();

// ceiling
    //         bodyDef = new b2d.b2BodyDef();
    //         bodyDef.position.x=10;
    //         bodyDef.position.y=10;
    //         bodyDef.userData = {eid:-100}
    //         boxDef = new b2d.b2PolygonDef();
    //         boxDef.SetAsBox(2, 0.5);
    //         boxDef.density=0;
    //         boxDef.friction=0.5;
    //         boxDef.restitution=0.2;
    //         sbody=world.CreateBody(bodyDef);
    //         sbody.CreateShape(boxDef);
    //         var last_link=sbody;
    //         var last_anchor_point=sbody.GetPosition();

    // // var last_link = this.body1.body;
    // // var last_anchor_point = this.body1.body.GetPosition();
    // var revolute_joint;

    // //height of rope elements, in metres ofcourse
    // var r_height = 1.1;
    // var dv = new b2d.b2Vec2(10,10)
    // // var dv = this.body2.get_position().Copy();
    // dv.Subtract(this.body1.get_position());
    // var dist = dv.Length();
    // dv.Normalize();
    // dv.Multiply(dist/(2*CONSTANTS.TETHER_NUM_NODES));
    // var u = this.body1.get_position().Copy();

    // var body = createBox(world, u.x, u.y, dv.Length(), r_height, CONSTANTS.TETHER_NODE_MASS, {eid: eids[i], team_id: team_id});
    // //rope
    // for (var i = 0; i < CONSTANTS.TETHER_NUM_NODES; i++)
    // {
    //     revolute_joint = new b2d.b2RevoluteJointDef();

    //     // Mid point
    //     u.Add(dv);

    //     var body = createBox(world, u.x, u.y, dv.Length(), r_height, CONSTANTS.TETHER_NODE_MASS, {eid: eids[i]});

    //     //revolute joint
    //     revolute_joint.Initialize(last_link, body, last_anchor_point.Copy())
    //     revolute_joint.enableLimit = true;
    //     revolute_joint.m_collideConnected = false;

    //     u.Add(dv);

    //     // Next anchor location
    //     last_anchor_point = u.Copy();

    //     //create the joint in world
    //     var j =world.CreateJoint(revolute_joint);
    //     j.SetLimits(-60, 60);

    //     // saving the reference of the last placed link
    //     last_link = body;
    // }

    // //revolute joint
    // revolute_joint = new b2d.b2RevoluteJointDef();
    // revolute_joint.Initialize(last_link, this.body2.body, last_anchor_point.Copy())
    // revolute_joint.enableLimit = true;
    // revolute_joint.m_collideConnected = false;
    // revolute_joint.enableMotor = true;
    // revolute_joint.maxMotorTorque = 20;
    // revolute_joint.motorSpeed = 360 * Math.PI/180;

    // //create the joint in world
    // var j = world.CreateJoint(revolute_joint);
    // j.SetLimits(-60, 60);

    // // Create internal nodes for rope
    // var dv = this.body2.get_position().Copy();
    // dv.Subtract(this.body1.get_position());
    // var dist = dv.Length();
    // dv.Normalize();
    // dv.Multiply(dist/(CONSTANTS.TETHER_NUM_NODES));

    // var RADIUS = 0.4 * (dist / CONSTANTS.TETHER_NUM_NODES);
    // for(var i = 0; i < CONSTANTS.TETHER_NUM_NODES; i++) {
    //     var u = this.body1.get_position().Copy();
    //     var v = dv.Copy();
    //     v.Multiply(i + 1);
    //     u.Add(v);
    //     var internal_node = new Particle(world, eids[i], u.x, u.y, CONSTANTS.TETHER_NODE_MASS, RADIUS);
    //     this.internal_nodes.push(internal_node);
    // }

    // // Model links with joints
    // var rjd1 = new b2d.b2RevoluteJointDef(),
    //     first_node = this.internal_nodes[0]
    //     dv = this.body1.get_position().Copy();
    // dv.Subtract(first_node.get_position());
    // dv.Multiply(0.5);
    // var anchor = this.body1.get_position().Copy();
    // rjd1.Initialize(this.body1.body, this.internal_nodes[0].body, anchor);
    // rjd1.collideConnected = false;
    // this.joints.push(world.CreateJoint(rjd1));
    // for(var i = 0; i < CONSTANTS.TETHER_NUM_NODES - 1; i++){
    //     var rjd = new b2d.b2RevoluteJointDef(),
    //         a = this.internal_nodes[i],
    //         b = this.internal_nodes[i+1];
    //     var dv = a.get_position().Copy();
    //     dv.Subtract(b.get_position());
    //     dv.Multiply(0.5);
    //     var anchor = a.get_position().Copy();
    //     anchor.Add(dv);
    //     rjd.Initialize(a.body, b.body, anchor);
    //     rjd.collideConnected = false;
    //     this.joints.push(world.CreateJoint(rjd));
    // }
    // var rjd2 = new b2d.b2RevoluteJointDef(),
    //     last_node = this.internal_nodes[CONSTANTS.TETHER_NUM_NODES - 1],
    //     dv = last_node.get_position().Copy();
    // dv.Subtract(this.body2.get_position());
    // dv.Multiply(0.5);
    // var anchor = last_node.get_position().Copy();
    // anchor.Add(dv);
    // rjd2.Initialize(last_node.body, this.body2.body, anchor);
    // rjd2.collideConnected = false;
    // this.joints.push(world.CreateJoint(rjd2));
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
