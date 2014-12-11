var canvas;
var controls;

var tether;

var world;
var particles;

// Networking
var socket;
var player_id = server_player_id;

var game_objects = {};
var world_state = {};

var loaded = false;
var our_team_id;

var game_object_prototypes = {
    player:Player.prototype.constructor,
    Asteroid:Asteroid.prototype.constructor,
    tether_node:TetherNode.prototype.constructor
};

function replicate_state() {
    // Create entities that exist in world state but not game.
    var keys = Object.keys(world_state);
    keys.forEach(function(eid) {
        if (!(eid in game_objects)) {
            if(world_state[eid].entity_type in game_object_prototypes) {
                game_objects[eid] = new game_object_prototypes[world_state[eid].entity_type](eid, world_state[eid]);
                if(world_state[eid].controller == player_id)
                    our_team_id = world_state[eid].team;
            }
        }
    });

    // Remove entities that exist in game but not world state.
    keys = Object.keys(game_objects);
    keys.forEach(function(eid) {
        if (!(eid in world_state)) {
            game_objects[eid].destroy();
            delete game_objects[eid];
        }
    });
}

function game_loop() {
    replicate_state();

    var keys = Object.keys(game_objects);
    keys.forEach(function(eid){
        game_objects[eid].update(world_state[eid]);
    });
    keys.forEach(function(eid){
        game_objects[eid].simulate();
    });
    keys.forEach(function(eid){
        game_objects[eid].draw();
    });

    particles.update(33.33);

    canvas.draw.redraw();
}

function update_world_state(state) {
    world_state = state;
}

function reset_game() {
    // Remove all entities that exist in game.
    keys = Object.keys(game_objects);
    keys.forEach(function(eid) {
        game_objects[eid].destroy();
        delete game_objects[eid];
    });

    world_state = {}
    world.clear();
    world.init();
    particles.clear();
    particles.init(100);
}

function prepare_game() {
    if(!loaded) {
        canvas = oCanvas.create({ canvas: "#game_canvas", background: "#232129" });
        controls = new Controls(canvas);
        world = new World();
        particles = new VisualParticles();
        socket = io();
        socket.on('world_state', update_world_state);
        socket.on('game_ended', game_over);

        loaded = true;

        canvas.setLoop(game_loop).start();
    } else {
        console.log("ERROR: game loaded a second time!");
    }
}

function game_over(data){
    var won = true;
    if(data == our_team_id){
        won = false;
    }

    if(won){
        $("#lobby_message").text("You Win!");
    }
    else{
        $("#lobby_message").text("You Lose!");
    }

    /*
    if(won){
        $("#end_game_container").css("visibility","visible");
    }
    else{
        $("#end_game_container").css("visibility","visible");
        $("#end_game").text("LOSER!").css("color","red").css("border-color","red");
    }
    */
}

