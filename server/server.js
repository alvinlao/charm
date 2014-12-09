module.exports.start = function(portNumber) {
	var app = require('express')();
	var http = require('http').Server(app);
	module.exports.io = require('socket.io')(http);
	var path = require('path');
	var appDir = path.dirname(require.main.filename);

	// ===============
	// Router
	// ===============
	
	// Main client
	app.get('/', function(req, res) {
		res.sendFile(appDir + '/client/index.html');
	})


	// ===============
	// Listen
	// ===============
	http.listen(portNumber, function(){
		console.log('listening on *:' + portNumber);
	});
}
