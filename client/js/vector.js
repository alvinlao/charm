function Vector2D(x, y) {
  this.x = x;
  this.y = y;
  return this;
}

Vector2D.prototype.add = function(other) {
  return Vector2D(this.x + other.x, this.y + other.y);
}
Vector2D.prototype.scale = function(k) {
  return Vector2D(k * this.x, k * this.y);
}
Vector2D.prototype.subtract = function(other) {
  return this.add(other.scale(-1));
}
Vector2D.prototype.dot = function(other) {
  return this.x * other.x + this.y * other.y;
}
Vector2D.prototype.length = function() {
  return Math.sqrt(this.dot(this));
}
Vector2D.prototype.direction = function() {
  var l = this.length();
  return Vector2D(this.x / l, this.y / l);
}
