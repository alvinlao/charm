var astroid_assets = ["assets/astroid_1.png", "assets/astroid_2.png", "assets/astroid_3.png", "assets/astroid_4.png"]
var astroid_assets_t0 = ["assets/astroid_1_t0.png", "assets/astroid_2_t0.png", "assets/astroid_3_t0.png", "assets/astroid_4_t0.png"]
var astroid_assets_t1 = ["assets/astroid_1_t1.png", "assets/astroid_2_t1.png", "assets/astroid_3_t1.png", "assets/astroid_4_t1.png"]

Asteroid.prototype = Object.create(Particle.prototype);
Asteroid.prototype.constructor = Asteroid;

function Asteroid(eid, state) {
	Particle.prototype.constructor.call(this, eid, state);

	this.dx = 0;
	this.dy = 0;
	this.rotation = 0;
}

Asteroid.prototype.init_draw = function(state) {
	this.asset_index = Math.floor(Math.random()*astroid_assets.length);
	this.drawable = canvas.display.image({
		x: this.x,
		y: this.y,
		origin: {x: "center", y: "center"},
		image: astroid_assets[this.asset_index],
		width: 2*state.r,
		height: 2*state.r
		}).add();
	this.drawable_t0 = canvas.display.image({
		x: this.x,
		y: this.y,
		origin: {x: "center", y: "center"},
		image: astroid_assets_t0[this.asset_index],
		width: 2*state.r,
		height: 2*state.r
		}).add();
	this.drawable_t1 = canvas.display.image({
		x: this.x,
		y: this.y,
		origin: {x: "center", y: "center"},
		image: astroid_assets_t1[this.asset_index],
		width: 2*state.r,
		height: 2*state.r
		}).add();
	this.drawable.image = this.updateImage(state.team);

	this.drawable.rotateTo(Math.random()*360);
}

Asteroid.prototype.draw = function() {
	Particle.prototype.draw.call(this);
	this.drawable.moveTo(this.x, this.y);
	this.drawable_t0.moveTo(this.x, this.y);
	this.drawable_t1.moveTo(this.x, this.y);
}

Asteroid.prototype.replicate = function(state) {

	this.x = state.x;
	this.y = state.y;
    this.r = state.r;

    this.drawable.image = this.updateImage(state.team);
    if(state.team != null) {
    	particles.spawn(this.x + (0.5 - Math.random())*state.r, this.y + (0.5 - Math.random())*state.r, state.velocity.x/100, state.velocity.y/100, 1.5+Math.random(), 300 + 200*Math.random(), team_colors[state.team%2]);
    }
}

Asteroid.prototype.destroy = function() {
	this.drawable.remove();
	this.drawable_t1.remove();
	this.drawable_t2.remove();
}

Asteroid.prototype.updateImage = function(team) {
	this.drawable.opacity = (team == null) ? 1 : 0;
	this.drawable_t0.opacity = (team == 0) ? 1 : 0;
	this.drawable_t1.opacity = (team == 1) ? 1 : 0;
}
