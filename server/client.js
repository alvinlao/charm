var STATES = Object.freeze({
	LOBBY : 1,
	READY : 2,
	IN_GAME : 3
});

function Client(id) {
	this.id = id;

	this.x = 0;
	this.y = 0;
	this.state = STATES.LOBBY;
}

module.exports = {
	STATES : STATES,
	client_object : Client
}