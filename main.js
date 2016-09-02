$(document).ready(function(){

  // Fadeout instructions after 7 seconds
  setTimeout(function(){
    $('#instructions').fadeOut(2000);
  },5000)

  // Defining variables globally
  var degree = 0;
  var speed = 0;
  $('#rocket').css('transform','matrix(1, 0, 0, 1, 0, 0)')
  var shipLeft = parseInt($('#rocket').css('left'));
  var shipTop = parseInt($('#rocket').css('top'));
  var speedFractionX = parseFloat($('#rocket').css('transform').split(",")[1])
  var speedFractionY = parseFloat($('#rocket').css('transform').split(",")[3])


  // Defining keyboard inputs
  $(document).on('keydown', function(event) {
    var key = String.fromCharCode(event.which);
    shipLeft = parseInt($('#rocket').css('left'));
    shipTop = parseInt($('#rocket').css('top'));
    if (key === "W") {
      speed += 10;
    } else if(key === "S") {
      speed -= 20;
    } else if(key === "A") {
      degree -= 10;
      $('#rocket').css("transform", 'rotateZ(' + degree + 'deg)');
    } else if(key === "D") {
      degree += 10;
      $('#rocket').css("transform", 'rotateZ(' + degree + 'deg)');
    }
  });

  // Clock to control in-game elements
  var gameClockFast = setInterval(function(){
    // Getting ship's X and Y orientation (as number between -1 and 1)
    speedFractionX = parseFloat($('#rocket').css('transform').split(",")[1]);
    speedFractionY = parseFloat($('#rocket').css('transform').split(",")[3])
    // Getting ship's current X and Y coordinates
    shipLeft = parseInt($('#rocket').css('left'));
    shipTop = parseInt($('#rocket').css('top'));

    // Stops the rocket at the edges of the screen (eg. Rocket is outside bounds of screen AND facing outside)
    if ((parseInt($('#rocket').css('left')) < 0) && speedFractionX < 0)  {
      speedFractionX = 0;
    } else if ((parseInt($('#rocket').css('left')) > ($(window).width()-50)) && speedFractionX > 0) {
      speedFractionX = 0;
    }
    if ((parseInt($('#rocket').css('top')) < 0) && speedFractionY > 0)  {
      speedFractionY = 0;
    } else if ((parseInt($('#rocket').css('top')) > ($(window).height()-50)) && speedFractionY < 0) {
      speedFractionY = 0;
    }

    // Calculates ships location in the next clock cycle
    $('#rocket').css("top", shipTop - (speed * speedFractionY));
    $('#rocket').css("left", shipLeft + (speed * speedFractionX));

    // Speeding warning
    if (speed > 250) {
      $('#speed').html("Whoa slow down there");
    } else {
      $('#speed').html(speed);
    }

  },50)

});
