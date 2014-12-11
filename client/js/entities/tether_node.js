var ship_assets = ["assets/ship_1.png", "assets/ship_2.png"]
var ship_trail_assets = ["assets/ship_1_trail.png", "assets/ship_2_trail.png"]

TetherNode.prototype = Object.create(Particle.prototype);
TetherNode.prototype.constructor = TetherNode;

function TetherNode(eid, state) {
	Particle.prototype.constructor.call(this, eid, state);

	this.dx = 0;
	this.dy = 0;
	this.left = state.left;
	this.right = state.right;
}

TetherNode.prototype.init_draw = function(state) {
	this.drawable = canvas.display.ellipse({x: this.x, y: this.y, radius:8, fill:"white"}).add();

	this.left_drawable = null;
	this.right_drawable = null;

	if(this.left in world_state) {
		if(world_state[this.left].entity_type == "player") {
			console.log("Found left side");
			this.left_drawable = canvas.display.line({
		        start: { x: world_state[this.left].x , y: world_state[this.left].y },
		        end: { x: this.x, y: this.y },
		        stroke: "4px #0aa",
		        cap: "round"
    		}).add();
		}
	}

	if(this.right in world_state) {
		console.log("Found right side");
		this.right_drawable = canvas.display.line({
			        start: { x: this.x , y: this.y },
			        end: { x: world_state[this.right].x, y: world_state[this.right].y },
			        stroke: "4px #0aa",
			        cap: "round"
	    		}).add();
	}
	//this.drawable.strokeColor = "white";

	/*this.trail = canvas.display.image({
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
		width: 25, height: 25}).add();*/
}

TetherNode.prototype.control = function(state) {
    
}

TetherNode.prototype.replicate = function(state) {
	this.x = state.x;
	this.y = state.y;
}

TetherNode.prototype.draw = function() {
	Particle.prototype.draw.call(this);
	this.drawable.moveTo(this.x, this.y);
}

TetherNode.prototype.destroy = function() {
	this.drawable.remove();
}
