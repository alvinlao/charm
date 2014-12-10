function Vector(x, y) {
	this.x = x;
	this.y = y;

	return this;
}

Vector.prototype.multiply = function(s) {
	this.x *= s;
	this.y *= s;

	return this;
}

Vector.prototype.divide = function(s) {
	this.x /= s;
	this.y /= s;

	return this;
}

Vector.prototype.add = function(u) {
	this.x += u.x;
	this.y += u.y;

	return this;
}

Vector.prototype.sub = function(u) {
	this.x -= u.x;
	this.y -= u.y;

	return this;
}

Vector.prototype.dot = function(u) {
	return this.x * u.x + this.y * u.y;
}