var ship_assets = ["assets/ship_1.png", "assets/ship_2.png"]
var ship_trail_assets = ["assets/ship_1_trail.png", "assets/ship_2_trail.png"]

Player.prototype = Object.create(Particle.prototype);
Player.prototype.constructor = Player;

function Player(eid, state) {
	Particle.prototype.constructor.call(this, eid, state);

	this.dx = 0;
	this.dy = 0;
	this.rotation = 0;
}

Player.prototype.init_draw = function(state) {
	//this.drawable = canvas.display.ellipse({x: this.x, y: this.y, radius:20, fill:"white"}).add();
	//this.drawable.strokeColor = "white";

	state.team = 1;

	this.trail = canvas.display.image({
		x: this.x,
		y: this.y+24,
		origin: { x: "center", y: "center" },
		image: ship_trail_assets[state.team],
		width: 32, height: 38}).add();

	this.drawable = canvas.display.image({
		x: this.x,
		y: this.y,
		origin: { x: "center", y: "center" },
		image: ship_assets[state.team],
		width: 25, height: 25}).add();
}

Player.prototype.emitState = function(socket) {
	var state = {x: this.x, y: this.y, vx: this.vx, vy: this.vy, playerId: this.id};
  	socket.emit("player_state", state);
}

Player.prototype.control = function(state) {
	//Particle.prototype.update.call(this);
	var odx = this.dx;
	var ody = this.dy;
	this.dx = 0;
	this.dy = 0;

	if(controls.isControlDown(controls.key_map.up)) {
		this.dy -= 1;
	}
	if(controls.isControlDown(controls.key_map.down)) {
		this.dy += 1;
	}
	if(controls.isControlDown(controls.key_map.left)) {
		this.dx -= 1;
	}
	if(controls.isControlDown(controls.key_map.right)) {
		this.dx += 1;
	}
	if(this.dx != 0 && this.dy != 0) {
		this.dx *= 0.7071;
		this.dy *= 0.7071;
	}

	this.x += this.dx;
	this.y += this.dy;

	if(this.dx != 0 || this.dy != 0) {
		this.rotation = toDegrees(Math.atan2(this.dy, this.dx)) + 90;
	}

	if(this.dx != odx || this.dy != ody) {
		console.log(JSON.stringify({eid:this.eid, input:{x:this.dx, y:this.dy}}));

	    socket.emit("inputs", {eid:this.eid, input:{x:this.dx, y:this.dy}});
    }
}

Player.prototype.replicate = function(state) {
	this.dx = state.x - this.x; this.dx /= this.dx;
	this.dy = state.y - this.y;	this.dx /= this.dx;

	if(this.dx != 0 && this.dy != 0) {
		this.dx *= 0.7071;
		this.dy *= 0.7071;
	}

	if(this.dx != 0 || this.dy != 0) {
		this.rotation = toDegrees(Math.atan2(this.dy, this.dx)) + 90;
	}

	this.x = state.x;
	this.y = state.y;

}

Player.prototype.draw = function() {
	Particle.prototype.draw.call(this);
	this.drawable.rotateTo( this.rotation );
	this.drawable.moveTo(this.x, this.y);

	if(this.dx != 0 || this.dy != 0) {
		this.trail.opacity = 1;
		this.trail.rotateTo( this.rotation );

		var trail_offset = -18 + (4 - Math.random()*8);
		this.trail.moveTo(this.x + Math.cos(toRadians(this.rotation - 90))*trail_offset, this.y + Math.sin(toRadians(this.rotation - 90))*trail_offset);
	} else {
		this.trail.opacity = 0;
	}
}

Player.prototype.destroy = function() {
	this.drawable.remove();
}


function toDegrees(rad) {
	return rad * 180/Math.PI;
}

function toRadians(deg) {
	return deg * Math.PI/180;
}
