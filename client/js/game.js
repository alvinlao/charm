var canvas;
var controls;

// Game objects
var player1;
var player2;
var tether;

// Networking
var socket;
var player_id = 12345;

function game_loop() {
    // Handle controls
    buttons_held = [];
    for(var button in controls.key_map){
        if(controls.isControlDown(controls.key_map[button])) {
            buttons_held.push(button);
        }
    }

    console.log(buttons_held);

    var input_packet = {
        player_id: player_id,
        inputs: buttons_held
    };
    socket.emit("inputs", input_packet);

    // UPDATE
    // SIMULATE
    // DRAW
    player1.update();
    player1.simulate();
    player1.draw();

    canvas.draw.redraw();
}

$(document).ready(function(){
    canvas = oCanvas.create({ canvas: "#game_canvas", background: "#eee" });
    controls = new Controls(canvas);
    socket = io();

    tether = canvas.display.line({
        start: { x: 50, y: 50 },
        end: { x: 400, y: 50 },
        stroke: "4px #0aa",
        cap: "round"
    }).add();

    //player1 = canvas.display.ellipse({x: 50, y: 50, radius:20, fill:"black"}).add();
    player1 = new Player(1, 10, 10);
    player2 = canvas.display.ellipse({x: 400, y: 50, radius:20, fill:"black"}).add();

    canvas.setLoop(game_loop).start();
});
