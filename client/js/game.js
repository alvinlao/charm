var canvas;
var controls;

var tether;

var game_objects = {};
var game_state = {1:{
    controller:1,
    entity_type:"player"
}};

var game_object_prototypes = {
    player:Player.prototype.constructor
};

function replicate_state() {
    keys = Object.keys(game_state);
    keys.forEach(function(eid){
        if (eid in game_objects) {
            if(game_state[eid] == null) {
                game_objects[eid].destroy();
                delete game_objects[eid];
            }
        } else {
            if(game_state[eid].entity_type in game_object_prototypes) {
                game_objects[eid] = new game_object_prototypes[game_state[eid].entity_type](eid);
            }
        }
    });
}

function game_loop() {
    replicate_state();

    var keys = Object.keys(game_objects);
    keys.forEach(function(eid){
        game_objects[eid].update();
    });
    keys.forEach(function(eid){
        game_objects[eid].simulate();
    });
    keys.forEach(function(eid){
        game_objects[eid].draw();
    });

    canvas.draw.redraw();
}

$(document).ready(function(){
    canvas = oCanvas.create({ canvas: "#game_canvas", background: "#eee" });
    controls = new Controls(canvas);
    
    tether = canvas.display.line({
        start: { x: 50, y: 50 },
        end: { x: 400, y: 50 },
        stroke: "4px #0aa",
        cap: "round"
    }).add();

    //player1 = canvas.display.ellipse({x: 50, y: 50, radius:20, fill:"black"}).add();
    //game_objects['1'] = new Player(1, 10, 10);

    canvas.setLoop(game_loop).start();
});




