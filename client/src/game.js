var canvas;
var controls;

var player1;
var player2;
var tether;

function draw_loop(){
    /*
    canvas.clear();
    */
    
    if(controls.isControlDown(controls.key_map.up)) {
        console.log("Up is pressed!");
    }
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
    player1 = canvas.display.ellipse({x: 50, y: 50, radius:20, fill:"black"}).add();
    player2 = canvas.display.ellipse({x: 400, y: 50, radius:20, fill:"black"}).add();

    canvas.setLoop(draw_loop).start();
});


