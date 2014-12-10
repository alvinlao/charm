var server = require('../server/server')
var game = require('../server/game')

server.io.on('connection', function(socket) {
	console.log('Client has connected: ' + socket.id);
	
	// Game connect
	game.connect(socket);

	socket.on('disconnect', function() {
		console.log('Client disconnect')

		// Game disconnect
		game.disconnect(socket);
	});
})