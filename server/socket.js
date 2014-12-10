var server = require('../server/server')
var game = require('../server/game')
var Brain = require('../server/brain')

var brain = new Brain();

server.io.on('connection', function(socket) {
	console.log('Client has connected: ' + socket.id);

	// Game connect
	if (!game.connect_player(socket)) {
		console.log('Game full');

		// Game has enough people
		socket.emit('game_full', 'Game is full');
	} else {
		game.broadcast_game_state(server);
	}

	socket.on('ready', function(player_id) {
		var team_id = game.get_team_id(player_id)
		console.log('Player (' + player_id + ') is on team (' + team_id + ')');
		game.player_ready(socket.id, player_id, team_id);

		// Broadcast lobby state
		var lobby_state = game.get_lobby_state();
		game.broadcast_game_state(server);

		// Start game
		if(game.is_ready()) {
			console.log('Start game')
			var teams = game.start();
			game.broadcast_game_state(server);

			console.log('Teams: ');
			console.log(teams);
			brain.start(teams, socket);
		}
	});

	socket.on('disconnect', function() {
		console.log('Client disconnect')

		// Game disconnect
		game.disconnect_player(socket);
		game.broadcast_game_state(server);
	});

    // **
    // GAME EVENTS
    // **
    socket.on('player_state', function(state) {
        console.log(state);
    });


    socket.on('inputs', function(state){
      if(state.inputs.length > 0){
            console.log(state);
      }
    });
})
