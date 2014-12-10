var STATES = Object.freeze({
  LOBBY: 1,
  GAME: 2,
  POST: 3
});

var state = STATES.LOBBY;
var socket;

function hide_all() {
  $('#lobby').hide();
  $('#game').hide();
}

function change_state(state) {
  state = state;

  hide_all();
  if (state == STATES.LOBBY) {
    $('#lobby').show();
  } else if(state == STATES.GAME) {
    $('#game').show();
  } else if(state == STATES.POST) {
    $('#lobby').show();
  }
}

$(function() {
  var socket = io();
  var player_id = -1;

  change_state(STATES.LOBBY);

  $(".player_button").click(function () {
    this.innerHTML = "LOADING...";
    player_id = (this.id == "player_one" ? 1 : (this.id == "player_two" ? 2 : (this.id == "player_three" ? 3 : 4)));
    socket.emit('ready', player_id);
  });

  socket.on('lobby_update', function (data) {
    $(".player_button").each(function ( index, value ) {
      $(this).attr('disabled','disabled');
      if (data[index]) {
        this.innerHTML = "JOINED";
      } else {
        this.innerHTML = "JOIN";
        if (player_id == -1) $(this).removeAttr('disabled');
      }
    });
  });

  socket.on('game_start', function () {
    change_state(STATES.GAME);
    start_game();
  });
})