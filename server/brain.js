var CONSTANTS = require('../server/constants')
var GameObject = require('../server/models/entities/gameobject')
var Particle = require('../server/models/entities/particle')
var ElasticParticle = require('../server/models/entities/elasticparticle')
var Player = require('../server/models/entities/player')
var Tether = require('../server/models/entities/tether')

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

Brain.prototype.start = function(team) {
    this.interval_id = setInterval(this.loop, CONSTANTS.LOOP_INTERVAL);
}

Brain.prototype.stop = function() {
    clearInterval(this.interval_id);
}

module.exports = Brain;
