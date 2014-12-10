var STATES = Object.freeze({
    LOBBY: 1,
    GAME: 2
});

var state = STATES.LOBBY;
var socket;

function hide_all() {
  $('#lobby').hide();
  $('#game').hide();
}

function change_state(new_state) {
  state = new_state;

  hide_all();
  if (state == STATES.LOBBY) {
    $('#lobby').show();
  } else if(state == STATES.GAME) {
    reset_lobby();
    $('#game').show();
    start_game();
  }
}

function reset_lobby() {
  console.log('reset')
  $('#lobby_message').innerHTML = "";
  $(".player_button").each(function ( index, value ) {
    this.innerHTML = "JOIN";
    $(this).removeAttr('disabled');
  });
}

function update_lobby(data) {
  var lobby_status = data.lobby;

  if(data.lobby_message) {
    $('#lobby_message').innerHTML = data.lobby_message;
  }

  $(".player_button").each(function ( index, value ) {
    $(this).attr('disabled','disabled');
    if (lobby_status[index]) {
      $(this).css('background-color', get_player_color(index));
      if(index == player_id - 1) {
        this.innerHTML = "YOU";
      } else {
        this.innerHTML = "JOINED";
      }
    } else {
      this.innerHTML = "JOIN";
      $(this).css('background-color', get_player_color(-1));
      $(this).removeAttr('disabled');
    }
  });
}

function get_player_color(player) {
  if (player === 0) {
    return "#5F98E3"
  } else if (player === 1) {
    return "#BE5FE3"
  } else if (player === 2) {
    return "#9FE35F"
  } else if (player === 3) {
    return "#E3855F"
  } else {
    return "#D1D1D1"
  }
}

function start_game() {
}

function update_game(data) {
}

$(function() {
  socket = io();

  change_state(STATES.LOBBY);

  socket.on('game_state_update', function(data) {
    if (state != data.state) {
      change_state(data.state);
    }

  socket.on('player_info', function(id) {
    console.log('hi')
    server_player_id = id;
  })

  $(".player_button").click(function () {
    this.innerHTML = "LOADING...";
    player_id = (this.id == "player_one" ? 1 : (this.id == "player_two" ? 2 : (this.id == "player_three" ? 3 : 4)));
    socket.emit('ready', player_id);
  });

  $(".instant_join").click(function () {
    change_state(STATES.GAME);
  });

  if (state == STATES.LOBBY) {
      update_lobby(data)
    } else if(state == STATES.GAME) {
      update_game(data);
    } else {
      throw "error!"
    }
  });
})
