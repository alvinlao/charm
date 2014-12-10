var GameObject = require('../entities/gameobject')
var CONSTANTS = require('../constants')
var Vector2D = require('../vector')

Particle.prototype = new GameObject();
Particle.prototype.constructor = Particle;

function Particle(eid, x, y, m, r) {
	GameObject.prototype.constructor.call(this, eid);

	this.x = x;
	this.y = y;
	this.m = m;
	this.r = r || CONSTANTS.EPSILON;

	this.V = Vector2D(0,0);	// velocity
	this.F = [];            // :: [Vector2D]
}

Particle.prototype.resetForces = function() {
    this.F = [];
}

Particle.prototype.applyForce = function(newForce) {
    this.F.push(newForce);
    return this;
}

Particle.prototype.getCentre = function() {
    return Vector2D(this.x, this.y);
}

Particle.prototype.distToCentre = function(other) {
    var x1 = this.getCentre(),
        x2 = other.getCentre();
    return x1.subtract(x2).length();
}

Particle.prototype.directionToCentre = function(other) {
    return other.getCentre().subtract(this.getCentre()).direction();
}

Particle.prototype.distanceTo = function(other) {
    return this.distanceToCentre(other) - (this.r + other.r);
}

Particle.prototype.intersects = function(other) {
    return this.distanceTo(other) <= CONSTANTS.EPSILON;
}

Particle.prototype.control = function () {
    var F_net = this.F.reduce(function(a, b) { return a.add(b); }, ZeroVector());
    this.resetForces();
    this.V.add(this.F_net.scale(1/this.m) * CONSTANTS.TIMEDELTA);
    this.x = this.V.x * CONSTANTS.TIMEDELTA;
    this.y = this.V.y * CONSTANTS.TIMEDELTA;
    return this;
}

Particle.prototype.collide = function(other) {
  var M = this.m + other.m,
      m = this.m * other.m,
      V = other.V.subtract(this.V),
      X = other.getCentre().subtract(this.getCentre()).direction(),
      k = (2 * m * V.dot(X))/M;
  this.applyForce(X.scale(k));
  return this;
}

Particle.prototype.serialize = function () {
  console.log("particle serialize called");
}

module.exports = Particle;
