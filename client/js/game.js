var canvas;
var controls;

var player1;
var player2;
var tether;

function game_loop(){
    
    // Example controls check
    if(controls.isControlDown(controls.key_map.up)) {
        
    }

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
    //initializeControls();
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


