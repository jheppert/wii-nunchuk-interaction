var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var five = require("johnny-five"), board, nunchuk;

board = new five.Board();

//Serve index.html when some make a request of the server
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

board.on("ready", function() {

  console.log("root directory: " + __dirname);

  // When using the WiiChuck adapter with an UNO,
  // these pins act as the Ground and Power lines.
  // This will not work on a Leonardo, so these
  // lines can be removed:

  // new five.Pin("A2").low();
  // new five.Pin("A3").high();

  // Create a new `nunchuk` hardware instance.
  nunchuk = new five.Wii.Nunchuk({
    freq: 0,
    holdtime: 0
  });


// BEGIN EVENT HANDLERS:
  nunchuk.joystick.on("change", function(err, event) {
    console.log(
      "joystick " + event.axis,
      event.target[event.axis],
      event.axis, event.direction
    );
    joystickChange(event.axis, event.direction, event.target[event.axis]);
  });


  nunchuk.accelerometer.on("change", function(err, event) {
    console.log(
      "accelerometer " + event.axis,
      event.target[event.axis],
      event.axis, event.direction
    );
    accelerometerChange(event.axis, event.direction, event.target[event.axis]);
  });



  ["down", "up", "hold"].forEach(function(type) {

    nunchuk.on(type, function(err, event) {
      console.log(
        event.target.which + " is " + type,

        {
          isUp: event.target.isUp,
          isDown: event.target.isDown
        }
      );
    });

  });



}); // END board.on("ready") function



http.listen(3000, function() {
    console.log('listening on *:3000');
});



// FUNCTIONS:

function joystickChange(axis, direction, amount) {
  io.sockets.emit('joystickChange', {axis: axis, direction: direction, amount: amount});
}


function accelerometerChange(axis, direction, amount) {
  io.sockets.emit('accelerometerChange', {axis: axis, direction: direction, amount: amount});
}