var ship_assets = ["assets/ship_1.png", "assets/ship_2.png"]
var ship_trail_assets = ["assets/ship_1_trail.png", "assets/ship_2_trail.png"]

TetherNode.prototype = Object.create(Particle.prototype);
TetherNode.prototype.constructor = TetherNode;

function TetherNode(eid, state) {
	this.left_eid = state.left;
	this.right_eid = state.right;

	Particle.prototype.constructor.call(this, eid, state);

	this.dx = 0;
	this.dy = 0;
}

TetherNode.prototype.init_draw = function(state) {
	//this.drawable = canvas.display.ellipse({x: this.x, y: this.y, radius:8, fill:"white"}).add();

	this.left_drawable = null;
	this.right_drawable = null;

	if(!state.team) {
		state.team = 0;
	}

	if(this.left_eid in world_state) {
		if(world_state[this.left_eid].entity_type == "player") {
			this.left_drawable = canvas.display.line({
		        start: { x: world_state[this.left_eid].x , y: world_state[this.left_eid].y },
		        end: { x: this.x, y: this.y },
		        stroke: "4px #ecaf4f",
		        cap: "round",
		        shadow: "0px 0px 6px " + team_colors[state.team]
    		}).add();
		}
	}

	if(this.right_eid in world_state) {
		this.right_drawable = canvas.display.line({
			        start: { x: this.x , y: this.y },
			        end: { x: world_state[this.right_eid].x, y: world_state[this.right_eid].y },
			        stroke: "4px #ecaf4f",
			        cap: "round",
			        shadow: "0px 0px 6px " + team_colors[state.team]
	    		}).add();
	}
}

TetherNode.prototype.control = function(state) {
    
}

TetherNode.prototype.replicate = function(state) {
	this.x = state.x;
	this.y = state.y;
}

TetherNode.prototype.draw = function() {
	Particle.prototype.draw.call(this);
	//this.drawable.moveTo(this.x, this.y);

	if(this.left_drawable != null) {
		this.left_drawable.start.x = world_state[this.left_eid].x;
		this.left_drawable.start.y = world_state[this.left_eid].y;
		this.left_drawable.end.x = this.x;
		this.left_drawable.end.y = this.y;
	}
	if(this.right_drawable != null) {
		this.right_drawable.start.x = this.x;
		this.right_drawable.start.y = this.y;
		this.right_drawable.end.x = world_state[this.right_eid].x;
		this.right_drawable.end.y = world_state[this.right_eid].y;
		
	}
}

TetherNode.prototype.destroy = function() {
	//this.drawable.remove();
	if(this.left_drawable != null) {
		this.left_drawable.remove();
	}
	if(this.right_drawable != null) {
		this.right_drawable.remove();
	}
}
