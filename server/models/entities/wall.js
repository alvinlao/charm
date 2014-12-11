var GameObject = require('../entities/gameobject')
var CONSTANTS = require('../../constants')
var b2d = require('box2d')

Wall.prototype = Object.create(GameObject.prototype);
Wall.prototype.constructor = Wall;

function Wall(world, eid, x, y, width, height) {
	GameObject.prototype.constructor.call(this, eid);

    var body_def = new b2d.b2BodyDef();
    body_def.userData = {eid: eid};
    body_def.position.Set(x,y);

    this.body = world.CreateBody(body_def);

    var polygon_def = new b2d.b2PolygonDef();
    polygon_def.restitution = 0.8;
    polygon_def.SetAsBox(width, height);
    this.body.CreateShape(polygon_def);
    
    return this;
}

module.exports = Wall;