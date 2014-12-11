var CONSTANTS = require('../server/constants')
var GameObject = require('../server/models/entities/gameobject')
var Particle = require('../server/models/entities/particle')
var Player = require('../server/models/entities/player')
var Asteroid = require('../server/models/entities/asteroid')
var Tether = require('../server/models/entities/tether')
var b2d = require("box2d")

function Brain() {
}

Brain.prototype.get_eid = function() {
    return this.eid++;
}

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

    this.eid = 0;

    // List of inputs from players
    // eid => input
    this.inputs = {};
}

Brain.prototype.step = function() {
    this.process_inputs();
    this.world.Step(CONSTANTS.TIMEDELTA, 1);

    // Sync world and objects
    // Linked List
    var body_list = this.world.GetBodyList();
    while (body_list != null) {
        if (body_list.m_userData) {
            var eid = body_list.m_userData.eid;
            if(this.objects[eid]) {
                this.objects[eid].sync(body_list);
            }
        }

        body_list = body_list.m_next;
    }
}

Brain.prototype.set_interval = function(loop, loopInterval){
}

Brain.prototype.queue_inputs = function(data) {
    this.inputs[data.eid] = data;
}

Brain.prototype.process_inputs = function() {
    for (var eid in this.inputs) {
        var input_data = this.inputs[eid];
        var input = input_data.input;

        var force = new b2d.b2Vec2(input.x, input.y);
        force.Multiply(CONSTANTS.INPUT_MULTIPLIER);
        this.objects[eid].apply_force(force);
        this.objects[eid].direction = input;
    }
}

Brain.prototype.loop = function(that) {
    that.step();
}

Brain.prototype.start = function(team, server) {
    this.game_loop_interval_id = setInterval(this.loop, CONSTANTS.LOOP_INTERVAL, this);

    this.init_world();

    // Create player objects
    for(var i=0; i<team.length; i++){
        for(var j=0; j<team[i].length; j++){
            var eid = this.get_eid();
            this.objects[eid] = new Player(this.world, eid, team[i][j].player_id, 100+100*i, 100+100*j);
        }
    }


    // Create some asteroids
    for(var i=0; i<10; i++){
        var x_pos = Math.random() * 500;
        var y_pos = Math.random() * 500;
        var eid = this.get_eid();
        this.objects[eid] = new Asteroid(this.world, eid, x_pos, y_pos);
    }

    var eids = [];
    for(var i = 0; i < CONSTANTS.TETHER_NUM_NODES; i++) {
        eids.push(this.get_eid());
    }
    // Tether(this.world, eids, this.objects[1], this.objects[2]);

    var brain = this;

    this.world_state_broadcast_interval_id = setInterval(function () {
    	server.io.emit('world_state', brain.return_world_state(brain));
    }, 33);
}

Brain.prototype.return_world_state = function(brain) {
	var serialized_objects = {};

	for (key in brain.objects) {
		serialized_objects[brain.objects[key].eid] = brain.objects[key].serialize();
	}

    console.log(serialized_objects);
	return serialized_objects;
}

Brain.prototype.stop = function() {
    clearInterval(this.game_loop_interval_id);
    clearInterval(this.world_state_broadcast_interval_id);
}

module.exports = Brain;
