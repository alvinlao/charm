Player.prototype = new Particle();
Player.prototype.constructor = Player;

function Player(id, x, y, m) {
	Particle.prototype.constructor.call(this, x, y, m);
	this.id = id;
	this.drawable = canvas.display.ellipse({x: this.x, y: this.y, radius:20, fill:"black"}).add();
}

Player.prototype.emitState = function(socket) {
	var state = {x: this.x, y: this.y, vx: this.vx, vy: this.vy, playerId: this.id};
  	socket.emit("player_state", state);
}

Player.prototype.update = function() {
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

Player.prototype.draw = function() {
	Particle.prototype.draw.call(this);
	this.drawable.moveTo(this.x, this.y);
}

Player.prototype.input = function(input) {
  
}
