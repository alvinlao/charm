var server = require('../server/server')
var game = require('../server/game')
var Brain = require('../server/brain')

var brain = new Brain();

server.io.on('connection', function(socket) {
    game.set_server(server);
	console.log('Client has connected: ' + socket.id);

	// Game connect
	if (!game.connect_player(socket)) {
		console.log('Game full');

		// Game has enough people
		socket.emit('game_full', 'Game is full');
        return;
	} else {
		game.broadcast_game_state();
	}

    // Send player info
    socket.emit('player_info', socket.id);

	socket.on('ready', function(player_id) {
		var team_id = game.get_team_id(player_id)
		console.log('Player (' + player_id + ') is on team (' + team_id + ')');
		game.player_ready(socket.id, player_id, team_id);

		// Broadcast lobby state
		var lobby_state = game.get_lobby_state();
		game.broadcast_game_state();

		// Start game
		if(game.is_ready()) {
			console.log('Start game')
			var teams = game.start();
			brain.start(teams, server, game);
		}
	});

	socket.on('disconnect', function() {
		console.log('Client disconnect')

		// Game disconnect
		game.disconnect_player(socket);

        if(!game.is_running()) {
            brain.stop();
        }
	});

    // **
    // GAME EVENTS
    // **
    socket.on('player_state', function(state) {
        console.log(state);
    });


    /* Example:
    * {player_id: 12345,
    *  inputs:["up"]}
    */
    socket.on('inputs', function(data){
        brain.queue_inputs(data);
    });
})
