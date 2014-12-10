Player.prototype = new Particle();
Player.prototype.constructor = Player;

function Player(id, x, y) {
	Particle.prototype.constructor.call(this, x, y);
	this.id = id;
}