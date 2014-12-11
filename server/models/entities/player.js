var Particle = require('../entities/Particle');
var b2d = require('box2d')

Player.prototype = Object.create(Particle.prototype);
Player.prototype.constructor = Player;

function Player(world, eid, player_id, x, y, team) {
	this.player_id = player_id;
	Particle.prototype.constructor.call(this, world, eid, x, y, 10);
    this.direction = new b2d.b2Vec2(0,0);
    this.team = team;
    return this;
}

Player.prototype.input = function(input_list) {
    for(var i=0; i<input_list.length; i++){
        var button = input_list[i];
        if(button == "up") {
            this.y -= 6;
        }
        if(button == "down") {
            this.y += 6;
        }
        if(button == "left") {
            this.x -= 6;
        }
        if(button == "right") {
            this.x += 6;
        }
    }
}

Player.prototype.serialize = function () {
    var pos = this.get_position();
	return {
		entity_type: "player",
		x : pos.x,
		y : pos.y,
        vx: this.v.x,
        vy: this.v.y,
        team: this.team,
        direction: this.direction,
		controller : this.player_id
	}
}

module.exports = Player;
