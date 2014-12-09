var server = require('../server/server')

server.io.on('connection', function(socket) {
	console.log('Client has connected');
	
	socket.on('message', function(msg) {
		console.log(msg);
	})
})