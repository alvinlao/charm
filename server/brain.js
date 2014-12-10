var GameObject = require('../server/models/entities/gameobject')
var Particle = require('../server/models/entities/particle')
var ElasticParticle = require('../server/models/entities/elasticparticle')
var Player = require('../server/models/entities/player')
var Tether = require('../server/models/entities/tether')

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

Brain.prototype.start = function(team) {
    p = new Particle(10, 10, 1);
    console.log(p)
    game_interval_id = setInterval(loop, CONSTANTS.LOOP_INTERVAL);
}

module.exports = Brain;
