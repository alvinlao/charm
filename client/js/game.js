var canvas;
var controls;

var player1_object;
var player1_particle;
var tether;

function game_loop(){
    canvas.clear();
    
    // Handle controls
    buttons_held = [];
    for(var button in controls.key_map){
        if(controls.isControlDown(controls.key_map[button])) {
            buttons_held.push(button);
        }
    }

    console.log(buttons_held);

    // UPDATE
    // SIMULATE
    // DRAW
}

$(document).ready(function(){
    canvas = oCanvas.create({ canvas: "#game_canvas", background: "#eee" });
    controls = new Controls(canvas);
    //initializeControls();
    tether = canvas.display.line({
        start: { x: 50, y: 50 },
        end: { x: 400, y: 50 },
        stroke: "4px #0aa",
        cap: "round"
    }).add();
    player1_object = canvas.display.ellipse({x: 50, y: 50, radius:20, fill:"black"}).add();
    player1_particle = Particle(50, 50, 1, 20);
    //player2 = canvas.display.ellipse({x: 400, y: 50, radius:20, fill:"black"}).add();

    canvas.setLoop(game_loop).start();
});




