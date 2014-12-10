var state = {
	state: 'lobby',
	clients: {},
	teams: {},

	connect: connect,
	disconnect: disconnect
}
module.exports = state;

function connect(socket) {
	if (!(socket.id in state.clients)) {
		state.clients[socket.id] = {
			id: socket.id,
			team: -1
		}
	}
}

function disconnect(socket) {
	if (socket.id in state.clients) {
		delete state.clients[socket.id]
	}
}