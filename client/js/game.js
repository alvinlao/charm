var canvas;
var controls;

// Game objects
var player1;
var player2;
var tether;

// Networking
var socket;
var player_id = -1;

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

    // UPDATE
    // SIMULATE
    // DRAW
    player1.update();
    player1.simulate();
    player1.draw();

    canvas.draw.redraw();
}

/* Example:
 * {player_id: 54321,
 *  inputs: ["up"]}
 */
function update_other_players(state){
    player2.input(state[54321]);
    player2.draw();
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

    player1 = new Player(1, 100, 100);
    player2 = new Player(1, 400, 100);

    canvas.setLoop(game_loop).start();
});
