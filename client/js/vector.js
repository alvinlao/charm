function Vector2D(x, y) {
  this.x = x;
  thix.y = y;
  return this;
}

Vector2D.prototype.add = function(other) {
  return Vector2D(this.x + other.x, this.y + other.y);
}
Vector2d.prototype.scale = function(k) {
  return Vector2D(k * this.x, k * this.y);
}
Vector2D.prototype.subtract = function(other) {
  return this.add(other.scale(-1));
}
Vector2D.prototype.dot = function(other) {
  return this.x * other.x + this.y * other.y;
}
Vector2D.prototype.norm = function() {
  return Math.sqrt(this.dot(this));
}
