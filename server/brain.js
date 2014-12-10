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
}

Brain.prototype.set_interval = function(loop, loopInterval){
}

Brain.prototype.process_inputs = function(inputs) {
    var targetId = inputs.id;
}

Brain.prototype.loop = function() {
    for(var objectId in this.objects) {
        this.objects[objectId].update()
    }
}

Brain.prototype.start = function(team, socket) {
    game_interval_id = setInterval(this.loop, CONSTANTS.LOOP_INTERVAL);

    var brain = this;

    world_state_broadcast_interval = setInterval(function () {
    	socket.emit('world_state', brain.return_world_state);
    }, 1000);
}

Brain.prototype.return_world_state = function() {
	var serialized_objects = [];

	for (key in this.objects) {
		serialized_objects.push(this.objects[key].serialize());
	}

	return serialized_objects;
}

module.exports = Brain;
