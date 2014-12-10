var server = require('../server/server')
var game = require('../server/game')
// var brain = require('../server/brain')

server.io.on('connection', function(socket) {
	console.log('Client has connected: ' + socket.id);
	
	// Game connect
	if (!game.connect(socket)) {
		console.log('Game full')
		
		// Game has enough people
		socket.emit('game full', 'Game is full')
	}

	if (game.is_ready()) {
		console.log('Start game')
		var teams = game.assign_teams();

		// Alert clients
		server.io.emit('game start', true);
		game.start();

		// Start logic
		// brain.start(teams);
	}

	socket.on('disconnect', function() {
		console.log('Client disconnect')

		// Game disconnect
		game.disconnect(socket);
	});
})