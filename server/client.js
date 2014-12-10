var STATES = Object.freeze({
	LOBBY : 1,
	READY : 2,
	IN_GAME : 3
});

function Client(socket) {
	this.socket = socket;
	this.id = socket.id;

	this.x = 0;
	this.y = 0;
	this.team = -1;
	this.player_id = -1;
	this.state = STATES.LOBBY;
}

module.exports = {
	STATES : STATES,
	client_object : Client
}