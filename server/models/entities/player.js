var Particle = require('../entities/Particle');

Player.prototype = new Particle();
Player.prototype.constructor = Player;

function Player(eid, player_id) {
	this.player_id = player_id;

	Particle.prototype.constructor.call(this, eid, 0, 0, 10);
}

Player.prototype.init_draw = function() {
	// this.drawable = canvas.display.ellipse({x: this.x, y: this.y, radius:20, fill:"black"}).add();
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

Player.prototype.replicate = function(state) {
	this.x = state["x"];
	this.y = state["y"];
}

Player.prototype.draw = function() {
	Particle.prototype.draw.call(this);
	this.drawable.moveTo(this.x, this.y);
}

Player.prototype.destroy = function() {
	this.drawable.remove();
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
	return {
		entity_type: "player",
		x : this.x,
		y : this.y,
		controller : this.player_id
	}
}

module.exports = Player;
