function GameObject(eid) {
  this.eid = eid;
}

GameObject.prototype.init_draw = function() {}
GameObject.prototype.draw = function() {}

GameObject.prototype.update = function(state) {
	if(state["controller"] == player_id) {
		this.control(state);
	} else {
		this.replicate(state);
	}
}

GameObject.prototype.control = function(state) {}
GameObject.prototype.replicate = function(state) {}

GameObject.prototype.simulate = function() {}
GameObject.prototype.destroy = function() {}

GameObject.prototype.serialize = function () {}

module.exports = GameObject;
