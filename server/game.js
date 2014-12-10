var client_module = require('../server/client');

var NUM_PLAYERS = 4;
var NUM_TEAMS = 2;

var STATES = Object.freeze({
	LOBBY : 1,
	IN_GAME : 2
});

var state = {
	state: STATES.LOBBY,
	clients: [],

	lobby_message: null,

	connect_player: connect_player,
	disconnect_player: disconnect_player,
	is_ready: is_ready,
	start: start,
	stop: stop,
	get_team_id: get_team_id,
	player_ready: player_ready,
	get_lobby_state: get_lobby_state,
	broadcast_game_state: broadcast_game_state,
}

function connect_player(socket) {
	if(state.clients.length >= NUM_PLAYERS) {
		return false;
	}

	if (get_client(socket.id) == null) {
		state.clients.push(new client_module.client_object(socket.id));
	}

	return true;
}

function disconnect_player(socket) {
	for(var i = 0; i < state.clients.length; ++i) {
		var client = state.clients[i];
		if (client.id == socket.id) {
			state.clients.splice(i, 1);

			if(state.state == STATES.IN_GAME) {
				// Disconnect
				state.lobby_message = "A player disconnected";
				state.state = STATES.LOBBY;
			}
			return;
		}
	}
}

function get_client(client_id) {
	for(var i = 0; i < state.clients.length; ++i) {
		var client = state.clients[i];
		if (client.id == client_id) {
			return client;
		}
	}

	return null;
}

function player_ready(client_id, player_id, team_id) {
	var client = get_client(client_id)
	client.state = client_module.STATES.READY;
	client.team = team_id;
	client.player_id = player_id;
}

function is_ready() {
	for (var i = 0; i < state.clients.length; i++) {
		var client = state.clients[i];
		if (client.state != client_module.STATES.READY)
			return false;
	}

	return state.clients.length >= NUM_PLAYERS && state.state == STATES.LOBBY;
}

function start() {
	console.log(state)
	state.state = STATES.IN_GAME;
	var teams = [];
	for (var i = 0; i < NUM_TEAMS; ++i) {
		teams.push([]);
	}

	for (var i = 0; i < state.clients.length; i++) {
		var client = state.clients[i]
		teams[client.team].push(client)
	}

	return teams;
}

function stop() {
	state.state = STATES.LOBBY;
}

function broadcast_game_state(server) {
	var data = {state: state.state};

	if(state.state == STATES.LOBBY) {
		data.lobby = get_lobby_state();
		data.lobby_message = state.lobby_message;
		state.lobby_message = null;
		server.io.emit('game_state_update', data);
	} else if (state.state == STATES.IN_GAME) {
		server.io.emit('game_state_update', data);
	}
}

function get_team_id(player_id) {
	if (player_id < 2) {
		return 0;
	} else {
		return 1;
	}
}

function get_lobby_state() {
	var lobby_state = [];
	for(var i = 0; i < NUM_PLAYERS; ++i) {
		lobby_state.push(false)
	}

	for(var i = 0; i < state.clients.length; i++) {
		var client = state.clients[i];
		lobby_state[client.player_id-1] = (client.state == client_module.STATES.READY);
	}

	console.log("lobby state: " + lobby_state);
	return lobby_state;
}

// EXPORT!
module.exports = state;