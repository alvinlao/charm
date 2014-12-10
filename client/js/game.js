var canvas;
var controls;

var tether;

// Networking
var socket;
var player_id = -1;

var game_objects = {};
var world_state = {1:{
        controller:-1,
        entity_type:"player",
        x:100,
        y:100
    }, 2:{
        controller:2,
        entity_type:"player",
        x:100,
        y:100
    }
};

var game_object_prototypes = {
    player:Player.prototype.constructor
};

function replicate_state() {
    keys = Object.keys(world_state);
    keys.forEach(function(eid) {
        if (eid in game_objects) {
            if(world_state[eid] == null) {
                game_objects[eid].destroy();
                delete game_objects[eid];
            }
        } else {
            if(world_state[eid].entity_type in game_object_prototypes) {
                game_objects[eid] = new game_object_prototypes[world_state[eid].entity_type](eid);
            }
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

/* Example:
 * {player_id: 54321,
 *  inputs: ["up"]}
 */
function update_other_players(state){
    //player2.input(state[54321]);
    //player2.draw();
}

$(document).ready(function(){
    canvas = oCanvas.create({ canvas: "#game_canvas", background: "#eee" });
    controls = new Controls(canvas);
    socket = io();
    socket.on('all_inputs', update_other_players);

    tether = canvas.display.line({
        start: { x: 50, y: 50 },
        end: { x: 400, y: 50 },
        stroke: "4px #0aa",
        cap: "round"
    }).add();

    canvas.setLoop(game_loop).start();
});
