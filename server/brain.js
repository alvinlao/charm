var CONSTANTS = require('../server/constants')
var GameObject = require('../server/models/entities/gameobject')
var Particle = require('../server/models/entities/particle')
var ElasticParticle = require('../server/models/entities/elasticparticle')
var Player = require('../server/models/entities/player')
var Tether = require('../server/models/entities/tether')

var world_state_broadcast_interval = -1;

function Brain() {
    this.objects = {};
    this.actions = [];

    this.interval_id;

    // Map of inputs
    // client_id -> inputs
    this.inputs = {};
}

Brain.prototype.set_interval = function(loop, loopInterval){
}

Brain.prototype.queue_inputs = function(client_id, inputs) {
    this.inputs[clinet_id] = inputs;
}

Brain.prototype.process_inputs = function() {
    for (key in this.inputs) {
        var input = this.inputs[key];
        this.inputs[key] = [];

        // TODO, process input
    }
}

Brain.prototype.loop = function() {
    for(var objectId in this.objects) {
        this.objects[objectId].update()
    }
}

Brain.prototype.start = function(team, server) {
    this.interval_id = setInterval(this.loop, CONSTANTS.LOOP_INTERVAL);

    var brain = this;

    // Create player objects
    this.objects[1] = new Player(1,1);
    this.objects[1].x = 100;
    this.objects[1].y = 100;
    this.objects[2] = new Player(2,2);
    this.objects[2].x = 600;
    this.objects[2].y = 100;

    world_state_broadcast_interval = setInterval(function () {
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
    clearInterval(this.interval_id);
}

module.exports = Brain;
