function GameObject(eid) {
  this.dt = 1;
  this.eid = eid;
  this.init_draw();
}

GameObject.prototype.init_draw = function() {}
GameObject.prototype.draw = function() {}
GameObject.prototype.update = function() {}
GameObject.prototype.simulate = function() {}
GameObject.prototype.destroy = function() {}
