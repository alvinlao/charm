var client = require('../server/client');

var NUM_PLAYERS = 1;
var NUM_TEAMS = 1;

var STATES = Object.freeze({
	LOBBY : 1,
	IN_GAME : 2,
	POST_GAME: 3
});

var state = {
	state: STATES.LOBBY,
	clients: {},
	num_clients: 0,
	teams: {},

	connect: connect,
	disconnect: disconnect,
	is_ready: is_ready,
	assign_teams: assign_teams,
	start: start,
}

function connect(socket) {
	if (state.num_clients >= NUM_PLAYERS) {
		return false;
	}

	if (!(socket.id in state.clients)) {
		state.clients[socket.id] = new client.client_object(socket.id);
		++state.num_clients;
	}

	return true;
}

function disconnect(socket) {
	if (socket.id in state.clients) {
		delete state.clients[socket.id]
		--state.num_clients;
	}
}

function is_ready() {
	return Object.keys(state.clients).length >= NUM_PLAYERS && state.state == STATES.LOBBY;
}

function assign_teams() {
	var clients = Object.keys(state.clients);
	var teams = [];
	var team;

	while (teams.length < NUM_TEAMS) {
		team = []

		while(team < NUM_PLAYERS) {
			var index = Math.random() * clients.length;
			team.push(clients[index])
			clients.splice(index, 1)
		}

		teams.push(team)
	}

	return teams;
}

function start() {
	console.log(state)
	state.state = STATES.IN_GAME;
}

// EXPORT!
module.exports = state;