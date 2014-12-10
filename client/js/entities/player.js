Player.prototype = new Particle();
Player.prototype.constructor = Player;

function Player(eid) {
	Particle.prototype.constructor.call(this, eid, 100, 100);
}

Player.prototype.init_draw = function() {
	this.drawable = canvas.display.ellipse({x: this.x, y: this.y, radius:20, fill:"white"}).add();
	//this.drawable.strokeColor = "white";

	this.trail = canvas.display.image({
		x: this.x,
		y: this.y+24,
		origin: { x: "center", y: "center" },
		image: "assets/player_ship_trail.png",
		width: 37, height: 69}).add();

	this.drawable = canvas.display.image({
		x: this.x,
		y: this.y,
		origin: { x: "center", y: "center" },
		image: "assets/player_ship.png",
		width: 37, height: 43}).add();
}

Player.prototype.emitState = function(socket) {
	var state = {x: this.x, y: this.y, vx: this.vx, vy: this.vy, playerId: this.id};
  	socket.emit("player_state", state);
}

Player.prototype.control = function(state) {
	//Particle.prototype.update.call(this);
	//TODO; Change to force
	var x = 0;
	var y = 0;
	if(controls.isControlDown(controls.key_map.up)) {
		y += 1;
	}
	if(controls.isControlDown(controls.key_map.down)) {
		y -= 1;
	}
	if(controls.isControlDown(controls.key_map.left)) {
		x -= 1;
	}
	if(controls.isControlDown(controls.key_map.right)) {
		x += 1;
	}
	if(x != 0 && y != 0) {
		x *= 0.7071;
		y *= 0.7071;
	}

	console.log(JSON.stringify({eid:this.eid, input:{x:x, y:y}}));

    socket.emit("inputs", {eid:this.eid, input:{x:x, y:y}});
}

Player.prototype.replicate = function(state) {
	//this.drawable.strokeWidth = 3.0 - 2.0*Math.sqrt(Math.pow(state.x - this.x, 2) + Math.pow(state.y - this.y,2))/8.5;	

	this.x = state.x;
	this.y = state.y;

	//this.drawable.fill = "#FFAAAA";
}

Player.prototype.draw = function() {
	Particle.prototype.draw.call(this);
	this.drawable.moveTo(this.x, this.y);
}

Player.prototype.destroy = function() {
	this.drawable.remove();
}
