var five = require("johnny-five"),
  board, nunchuk;

board = new five.Board();

board.on("ready", function() {


  // Create a new `nunchuk` hardware instance.
  nunchuk = new five.Wii.Nunchuk({
    freq: 50
  });

  nunchuk.joystick.on("change", function(){
    console.log("joystick");
  });

});
