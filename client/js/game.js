var canvas;
var controls;

var tether;

// Networking
var socket;
var player_id = server_player_id;

var game_objects = {};
var world_state = {};

var game_object_prototypes = {
    player:Player.prototype.constructor
};

function replicate_state() {
    // Create entities that exist in world state but not game.
    var keys = Object.keys(world_state);
    keys.forEach(function(eid) {
        if (!(eid in game_objects)) {
            if(world_state[eid].entity_type in game_object_prototypes) {
                game_objects[eid] = new game_object_prototypes[world_state[eid].entity_type](eid);
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
    // Handle controls
    buttons_held = [];
    for(var button in controls.key_map){
        if(controls.isControlDown(controls.key_map[button])) {
            buttons_held.push(button);
        }
    }
    if(buttons_held.length > 0){
        //console.log(buttons_held);

        var input_packet = {
            player_id: player_id,
            inputs: buttons_held
        };
        socket.emit("inputs", input_packet);
    }

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

    canvas.draw.redraw();
}

function update_world_state(state) {
    world_state = state;
}

function prepare_game() {
    canvas = oCanvas.create({ canvas: "#game_canvas", background: "#232129" });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    controls = new Controls(canvas);
    socket = io();
    socket.on('world_state', update_world_state);

    tether = canvas.display.line({
        start: { x: 50, y: 50 },
        end: { x: 400, y: 50 },
        stroke: "4px #0aa",
        cap: "round"
    }).add();

    console.log("player id: " + server_player_id);

    canvas.setLoop(game_loop).start();
}
