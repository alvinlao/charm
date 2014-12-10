var CONSTANTS = require('../server/constants')
var GameObject = require('../server/models/entities/gameobject')
var Particle = require('../server/models/entities/particle')
var Player = require('../server/models/entities/player')
var Tether = require('../server/models/entities/tether')
var b2d = require("box2d")

function Brain() {
}

/* initial_bodies -- Map whose keys are ids and values are box2d world bodies
 */
Brain.prototype.init_world = function() {
    var worldAABB = new b2d.b2AABB(),
        gravity = new b2d.b2Vec2(0.0, 0.0),
        do_sleep = true;
    worldAABB.lowerBound.Set(CONSTANTS.LOWER_X, CONSTANTS.LOWER_Y);
    worldAABB.upperBound.Set(CONSTANTS.UPPER_X, CONSTANTS.UPPER_Y);

    this.world = new b2d.b2World(worldAABB, gravity, do_sleep);
    this.objects = {};
    this.actions = [];

    this.game_loop_interval_id = -1;
    this.world_state_broadcast_interval_id = -1;

    // Map of inputs
    // eid -> inputs
    this.inputs = [];
    return this;
}

Brain.prototype.add_body = function(eid, body_def) {
    var body = this.world.CreateBody(body_def);
    this.objects[eid] = body;
    return body;
}

Brain.prototype.add_joint = function(joint_def) {
    var joint = this.world.CreateJoint(joint_def);
    return joint;
}

Brain.prototype.step = function() {
    this.process_inputs();
    this.world.Step(CONSTANTS.TIMEDELTA, 1);
}

Brain.prototype.set_interval = function(loop, loopInterval){
}

Brain.prototype.queue_inputs = function(client_id, inputs) {
    this.inputs[client_id] = inputs;
}

Brain.prototype.process_inputs = function() {
    for (var i = 0; i < this.inputs.length; ++i) {
        var input = this.inputs[i];
        var eid = input.eid;
        var input_vector = input.input;

        var force = new b2Vec2(input_vector.x, input_vector.y);
        force.Multiply(CONSTANTS.INPUT_MULTIPLIER);
        this.objects[eid].apply_force(force);
    }

    this.inputs = [];
}

Brain.prototype.start = function(team, server) {
    this.game_loop_interval_id = setInterval(this.loop, CONSTANTS.LOOP_INTERVAL);

    var brain = this.init_world();
    console.log(this.world);
    console.log(brain.world);
    console.log("Hello!");

    // Create player objects
    this.objects[1] = new Player(this.world, 1,1);
    this.objects[1].x = 100;
    this.objects[1].y = 100;
    this.objects[2] = new Player(this.world, 2,2);
    this.objects[2].x = 600;
    this.objects[2].y = 100;

    this.world_state_broadcast_interval_id = setInterval(function () {
    	server.io.emit('world_state', brain.return_world_state());
    }, 1000);
}

Brain.prototype.return_world_state = function() {
	var serialized_objects = {};

	for (key in this.objects) {
		serialized_objects[this.objects[key].eid] = this.objects[key].serialize();
	}

    console.log(serialized_objects);
	return serialized_objects;
}

Brain.prototype.stop = function() {
    clearInterval(this.game_loop_interval_id);
    clearInterval(this.world_state_broadcast_interval_id);
}

module.exports = Brain;
