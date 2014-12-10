var Brain = (function () {
	var LOOP_PERIOD = 100;
	var game_interval_id = -1;

	var loop = function () {

	}

	return {
		start : function (team) {
			game_interval_id = setInterval(loop, LOOP_PERIOD);
		}
	}
})();

module.exports = Brain;