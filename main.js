$(document).ready(function(){

  // Defining variables globally
  var degree = 0;
  var speed = 0;
  $('#rocket').css('transform','matrix(1, 0, 0, 1, 0, 0)')
  var shipLeft = parseInt($('#rocket').css('left'));
  var shipTop = parseInt($('#rocket').css('top'));
  var speedFractionX = parseFloat($('#rocket').css('transform').split(",")[1])
  var speedFractionY = parseFloat($('#rocket').css('transform').split(",")[3])

  $('#game-canvas').attr('width',$(window).width()*0.98);
  $('#game-canvas').attr('height',$(window).height()*0.98);

  var img = new Image();
  // img.onload = function(){
  //   ctx.drawImage(document.getElementById('rocket'));
  // };
  img.src = "rocket.png";


  // Fadeout instructions after 7 seconds
  setTimeout(function(){
    $('#instructions').fadeOut(2000);
  },5000)




  // Defining keyboard inputs
  $(document).on('keydown', function(event) {
    var key = String.fromCharCode(event.which);
    shipLeft = parseInt($('#rocket').css('left'));
    shipTop = parseInt($('#rocket').css('top'));
    console.log(event.which);
    if (key === "W") {
      speed += 10;
    } else if(key === "S") {
      speed -= 20;
    } else if(key === "A") {
      degree -= 15;
      $('#rocket').css("transform", 'rotateZ(' + degree + 'deg)');
    } else if(key === "D") {
      degree += 15;
      $('#rocket').css("transform", 'rotateZ(' + degree + 'deg)');
    }
    if (event.which == 32) {
      var fire = setInterval(update, 20);
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

  var canvas = document.getElementById("game-canvas"),
      ctx = canvas.getContext("2d");

  var W = 1300,
      H = 700;

  canvas.height = H; canvas.width = W;


  var ball = {};
  var cooldown = setInterval(function(){
    ball = {
      x: parseInt($('#rocket').css("left")) + 20,
      y: parseInt($('#rocket').css("top")) + 10,
      radius: 5,
      color: "white",
      vx: speedFractionX,
      vy: speedFractionY,
      draw: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
    };
  },1000)


  function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
  }

  function update() {
    clearCanvas();
    ball.draw();
    ball.y -= 30*speedFractionY;
    ball.x += 30*speedFractionX;
  }




});
