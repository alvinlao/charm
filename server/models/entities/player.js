var Particle = require('../entities/Particle');

Player.prototype = Object.create(Particle.prototype);
Player.prototype.constructor = Player;

function Player(world, eid, player_id, x, y) {
	this.player_id = player_id;
	Particle.prototype.constructor.call(this, world, eid, x, y, 10);
    return this;
}

Player.prototype.control = function(state) {
	//Particle.prototype.update.call(this);
	//TODO; Change to force
	if(controls.isControlDown(controls.key_map.up)) {
		this.y -= 6;
	}
	if(controls.isControlDown(controls.key_map.down)) {
		this.y += 6;
	}
	if(controls.isControlDown(controls.key_map.left)) {
		this.x -= 6;
	}
	if(controls.isControlDown(controls.key_map.right)) {
		this.x += 6;
	}
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
		controller : this.player_id
	}
}

module.exports = Player;
