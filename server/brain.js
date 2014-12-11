var CONSTANTS = require('../server/constants')
var GameObject = require('../server/models/entities/gameobject')
var Particle = require('../server/models/entities/particle')
var Player = require('../server/models/entities/player')
var Asteroid = require('../server/models/entities/asteroid')
var Wall = require('../server/models/entities/wall')
var Tether = require('../server/models/entities/tether')
var b2d = require("box2d")

function Brain() {
}

Brain.prototype.get_eid = function() {
    return this.eid++;
}

Brain.prototype.init_world = function() {
    b2d.b2Settings.b2_maxLinearVelocity = CONSTANTS.MAX_SPEED;
    b2d.b2Settings.b2_maxLinearVelocitySquared = CONSTANTS.MAX_SPEED * CONSTANTS.MAX_SPEED;
    var worldAABB = new b2d.b2AABB(),
        gravity = new b2d.b2Vec2(0.0, 0.0),
        do_sleep = true;
    worldAABB.lowerBound.Set(CONSTANTS.MIN_X, CONSTANTS.MIN_Y);
    worldAABB.upperBound.Set(CONSTANTS.MAX_X, CONSTANTS.MAX_Y);

    this.world = new b2d.b2World(worldAABB, gravity, do_sleep);
    this.objects = {};
    this.tether_nodes = {};
    this.actions = [];

    this.game_loop_interval_id = -1;
    this.world_state_broadcast_interval_id = -1;

    this.eid = 0;

    // List of inputs from players
    // eid => input
    this.inputs = {};
}

Brain.prototype.step = function() {
    this.process_inputs();
    this.world.Step(CONSTANTS.TIMEDELTA, 1);

    // Sync world and objects
    // Linked List
    var body_list = this.world.GetBodyList();
    while (body_list != null) {
        /*
         * WRAP LOGIC
         */
        // var current_position = body_list.GetPosition(),
        //     current_angle = body_list.GetAngle(),
        //     x0 = current_position.x,
        //     y0 = current_position.y,
        //     x1 = x0,
        //     y1 = y0;

        // if (x0 < CONSTANTS.MIN_X) {
        //     x1 = CONSTANTS.MAX_X;
        // } else if(x0 > CONSTANTS.MAX_X) {
        //     x1 = CONSTANTS.MIN_X;
        // }
        // if (y0 < CONSTANTS.MIN_Y) {
        //     y1 = CONSTANTS.MAX_Y;
        // } else if (y0 > CONSTANTS.MAX_Y) {
        //     y1 = CONSTANTS.MIN_Y;
        // }
        // var new_position = new b2d.b2Vec2(x1, y1);
        // body_list.SetXForm(new_position, current_angle);


        if (body_list.m_userData) {
            var eid = body_list.m_userData.eid;
            if(this.objects[eid]) {
                this.objects[eid].sync(body_list);
            }
        }

        body_list = body_list.m_next;
    }

    this.tether_nodes = {};
    var joint_list = this.world.GetJointList();
    while (joint_list != null) {
        var lefteid = joint_list.m_node1.other.m_userData.eid;
        var righteid = joint_list.m_node2.other.m_userData.eid;

        var leftp = joint_list.m_node1.other.m_xf.position;
        var rightp = joint_list.m_node2.other.m_xf.position;

        var left = {
            entity_type: 'tether_node',
            eid: lefteid,
            x: leftp.x,
            y: leftp.y,
            right: righteid,
        }

        var right = {
            entity_type: 'tether_node',
            eid: righteid,
            x: rightp.x,
            y: rightp.y,
            left: lefteid,
        }

        if(lefteid in this.tether_nodes) {
            this.tether_nodes[lefteid].right = righteid;
        } else {
            this.tether_nodes[lefteid] = left;
        }

        if(righteid in this.tether_nodes) {
            this.tether_nodes[righteid].left = lefteid;
        } else {
            this.tether_nodes[righteid] = right;
        }

        joint_list = joint_list.m_next;
    }
}

Brain.prototype.set_interval = function(loop, loopInterval){
}

Brain.prototype.queue_inputs = function(data) {
    this.inputs[data.eid] = data;
}

Brain.prototype.process_inputs = function() {
    for (var eid in this.inputs) {
        var input_data = this.inputs[eid];
        var input = input_data.input;

        var force = new b2d.b2Vec2(input.x, input.y);
        force.Multiply(CONSTANTS.INPUT_MULTIPLIER);
        this.objects[eid].apply_force(force);

        if(input.x != 0 || input.y != 0 || !this.objects[eid].direction) {
            this.objects[eid].direction = input;
            this.objects[eid].pressed = true;
        } else {
            this.objects[eid].pressed = false;
        }
    }
}

Brain.prototype.loop = function(that) {
    that.step();
}

Brain.prototype.start = function(team, server) {
    this.game_loop_interval_id = setInterval(this.loop, CONSTANTS.LOOP_INTERVAL, this);

    this.init_world();
    var previous_asteroids = [];

    // to be used in callbacks
    var brain = this;

    // Create player objects
    for(var i=0; i<team.length; i++){
        for(var j=0; j<team[i].length; j++){
            var eid = this.get_eid(),
                x0 = 100 + j * (CONSTANTS.MAX_X/2 - 300),
                y0 = 100 + i * (CONSTANTS.MAX_Y - 300);
            previous_asteroids.push([x0,y0]);
            this.objects[eid] = new Player(this.world, eid, team[i][j].player_id, x0, y0, i);
        }
    }


    // Create some asteroids
    for(var i=0; i<10; i++){
        while(true){
            var bound_x_min = 100;
            var bound_x_max = CONSTANTS.MAX_X - 100;
            var bound_y_min = 100;
            var bound_y_max = CONSTANTS.MAX_Y - 100;
            var x_pos = bound_x_min + Math.random() * (bound_x_max-bound_x_min);
            var y_pos = bound_y_min + Math.random() * (bound_y_max-bound_y_min);
            var radius = CONSTANTS.ASTEROID_MIN_SIZE + Math.random() * (CONSTANTS.ASTEROID_MAX_SIZE - CONSTANTS.ASTEROID_MIN_SIZE);

            var is_good = true;
            for(var j=0; j<previous_asteroids.length; j++){
                var prev_asteroid = previous_asteroids[j];
                var dist_squared = prev_asteroid[0]*prev_asteroid[0] + prev_asteroid[1]*prev_asteroid[1];
                if(dist_squared < 9000){
                    is_good = false;
                    break;
                }
            }
            if(is_good){
                previous_asteroids.push([x_pos, y_pos]);
                var eid = this.get_eid();
                this.objects[eid] = new Asteroid(this.world, eid, x_pos, y_pos, radius, false);
                break;
            }
        }
    }

    var eids = [];
    for(var i = 0; i < CONSTANTS.TETHER_NUM_NODES; i++) {
        eids.push(this.get_eid());
    }
    var b2 = this.objects[1].get_position();
    
    Tether(this.world, eids, this.objects[0], this.objects[1]);

    // north wall
    Wall(this.world, -1, 0, 0, CONSTANTS.MAX_X - CONSTANTS.MIN_X - 1, 1);

    // west wall
    Wall(this.world, -1, 0, 0, 1, CONSTANTS.MAX_Y - CONSTANTS.MIN_Y - 1);

    // south wall
    Wall(this.world, -1, -1, CONSTANTS.MAX_Y - CONSTANTS.MIN_Y - 2, CONSTANTS.MAX_X - CONSTANTS.MIN_X - 1, 1);

    // east wall
    Wall(this.world, -1, CONSTANTS.MAX_X - CONSTANTS.MIN_X - 3, 0, 1, CONSTANTS.MAX_Y - CONSTANTS.MIN_Y - 1);

    // set contact listener for active asteroid collisions
    var listener = new b2d.b2ContactListener();

    listener.Add = function(point) {
        var shape_one_data = point.shape1.GetBody().GetUserData(),
            shape_two_data = point.shape2.GetBody().GetUserData();

        if (shape_one_data["particle_type"] == CONSTANTS.TYPE_ASTEROID && shape_two_data["particle_type"] == CONSTANTS.TYPE_TETHER_NODE) {
            if (brain.objects[shape_one_data["eid"]].active) brain.end_game();
        } else if (shape_one_data["particle_type"] == CONSTANTS.TYPE_TETHER_NODE && shape_two_data["particle_type"] == CONSTANTS.TYPE_ASTEROID) {
            if (brain.objects[shape_two_data["eid"]].active) brain.end_game();
        }
    }

    this.world.SetContactListener(listener);

    this.world_state_broadcast_interval_id = setInterval(function () {
    	server.io.emit('world_state', brain.return_world_state(brain));
    }, 33);
}

Brain.prototype.end_game = function (losing_team) {
    console.log("GAME ENDED");
}

Brain.prototype.return_world_state = function() {
	var serialized_objects = {};

	for (key in this.objects) {
		serialized_objects[this.objects[key].eid] = this.objects[key].serialize();
	}

    for (eid in this.tether_nodes) {
        if (!(eid in serialized_objects)) {
            serialized_objects[eid] = this.tether_nodes[eid];
        }
    }
	return serialized_objects;
}

Brain.prototype.stop = function() {
    clearInterval(this.game_loop_interval_id);
    clearInterval(this.world_state_broadcast_interval_id);
}

module.exports = Brain;
