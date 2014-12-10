Player.prototype = new Particle();
Player.prototype.constructor = Player;

function Player(id, x, y, m) {
	Particle.prototype.constructor.call(this, x, y, m);
	this.id = id;
}

Player.prototype.emitState = function(socket) {
  var state = {x: this.x, y: this.y, vx: this.vx, vy: this.vy, playerId: this.id};
  socket.emit("player_state", state);
}

Player.prototype.input = function(input) {
  
}
