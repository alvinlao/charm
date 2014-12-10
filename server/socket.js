var server = require('../server/server')
var game = require('../server/game')
// var brain = require('../server/brain')

server.io.on('connection', function(socket) {
	console.log('Client has connected: ' + socket.id);
	
	// Game connect
	if (!game.connect(socket)) {
		console.log('Game full');

		// Game has enough people
		socket.emit('game_full', 'Game is full');
	} else {
		socket.emit('lobby_update', game.get_lobby_state());
	}

	socket.on('ready', function(player_id) {
		var team_id = game.get_team_id(player_id)
		console.log('Player (' + player_id + ') is on team (' + team_id + ')');
		game.player_ready(socket.id, player_id, team_id);

		// Broadcast lobby state
		var lobby_state = game.get_lobby_state();
		server.io.emit('lobby_update', lobby_state);

		// Start game
		if(game.is_ready()) {
			console.log('Start game')

			var teams = game.start();
			console.log(teams);
			brain.start(teams, socket);
		}
	})

	socket.on('disconnect', function() {
		console.log('Client disconnect')

		// Game disconnect
		game.disconnect(socket);
		server.io.emit('lobby_update', game.get_lobby_state());
	});
})