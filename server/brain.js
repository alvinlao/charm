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

    // List of inputs from players
    this.inputs = [];
}

Brain.prototype.add_body = function(id, body_def) {
    var body = this.world.CreateBody(body_def);
    this.objects[id] = body;
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

Brain.prototype.queue_inputs = function(data) {

    this.inputs.push(data);
}

Brain.prototype.process_inputs = function() {
    for (var i = 0; i < this.inputs.length; i++) {
        var input_data = this.inputs[i];
        var eid = input_data.eid;
        var input = input_data.input;

        var force = new b2d.b2Vec2(input.x, input.y);
        force.Multiply(CONSTANTS.INPUT_MULTIPLIER);
        this.objects[eid].apply_force(force);
    }

    this.inputs = [];
}

Brain.prototype.loop = function(that) {
    that.step();
}

Brain.prototype.start = function(team, server) {
    this.game_loop_interval_id = setInterval(this.loop, CONSTANTS.LOOP_INTERVAL, this);

    this.init_world();

    // Create player objects
    var eid = 1;
    for(var i=0; i<team.length; i++){
        for(var j=0; j<team[i].length; j++){
            this.objects[eid] = new Player(this.world, eid, team[i][j].player_id);
            this.objects[eid].x = 100;
            this.objects[eid].y = 100;
            eid++;
        }
    }
    this.objects[1] = new Player(this.world, 1,1, 100, 100);
    this.objects[2] = new Player(this.world, 2,2, 600, 100);
    //Tether(this.world, this.objects[1], this.objects[2]);

    var brain = this;

    this.world_state_broadcast_interval_id = setInterval(function () {
    	server.io.emit('world_state', brain.return_world_state());
    }, 1000);
}

Brain.prototype.return_world_state = function() {
	var serialized_objects = {};

	for (key in this.objects) {
		serialized_objects[this.objects[key].eid] = this.objects[key].serialize();
	}

	return serialized_objects;
}

Brain.prototype.stop = function() {
    clearInterval(this.game_loop_interval_id);
    clearInterval(this.world_state_broadcast_interval_id);
}

module.exports = Brain;
