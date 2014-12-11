function GameObject(eid) {
  this.eid = eid;
}

GameObject.prototype.update = function(state) {
	if(state["controller"] == player_id) {
		this.control(state);
	} else {
		this.replicate(state);
	}
}

GameObject.prototype.simulate = function() {}
GameObject.prototype.destroy = function() {}

GameObject.prototype.serialize = function () {}

module.exports = GameObject;
