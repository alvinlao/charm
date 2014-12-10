var server = require('../server/server')
var game = require('../server/game')

server.io.on('connection', function(socket) {
	console.log('Client has connected');
	
	server.io.emit('hello', game.state)
	socket.on('message', function(msg) {
		console.log(msg);
	})
})