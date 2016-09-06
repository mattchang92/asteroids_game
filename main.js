$(document).ready(function(){



  $(document).on('keydown', function(event) {
    var start = String.fromCharCode(event.which);
    if (start === "K") {


  // Define an Asteroid constructor
  function Asteroid(radius, speedX, speedY) {
      this.radius = radius;
      this.x = Math.random()* parseInt($(window).width());
      this.y = Math.random()*parseInt($(window).height());
      this.speedX = speedX;
      this.speedY = speedY;
  }

  // Move asteroid
  Asteroid.prototype.move = function() {
    this.y += this.speedX;
    this.x += this.speedY;
    if(this.y > $(window).height()) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = $(window).height();
    } else if (this.x > $(window).width()) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = $(window).width();
    }

  }

  // Draw asteroid
  Asteroid.prototype.draw = function() {
      ctx.clearRect(0, 0, $(window).width(), $(window).height());
      var picture = document.getElementById('asteroid');
      var pattern = ctx.createPattern(picture,'repeat');
      ctx.beginPath();
      ctx.fillStyle = pattern;
      ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
      ctx.closePath();
      ctx.fill();
  }
  // Define a Bullet constructor
  function Bullet(radius, speed) {
      this.radius = radius;
      this.x = parseInt($('#rocket').css('left'))+20;
      this.y = parseInt($('#rocket').css('top'))+20;
      this.speedX = speed * parseFloat($('#rocket').css('transform').split(",")[1]);
      this.speedY = speed * parseFloat($('#rocket').css('transform').split(",")[3]);
  }

  // Bullet move
  Bullet.prototype.move = function() {
    this.x += this.speedX;
    this.y -= this.speedY;
  }

  // Draw bullet
  Bullet.prototype.draw = function() {
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
      ctx.closePath();
      ctx.fill();
  }


  var direction = [1,-1];
  var asteroids = [];
  var bullets = [];

  // var createAsteroids = setInterval(function(){
    asteroids.push(new Asteroid(Math.random()*15 + 15, Math.random()* 5 * direction[Math.round(Math.random())], Math.random()* 5 * direction[Math.round(Math.random())]));
  // }, 2000 );

  // Defining variables globally
  var degree = 0;
  var speed = 0;
  var cooldown = false;
  $('#rocket').css('transform','matrix(1, 0, 0, 1, 0, 0)')
  var shipLeft = parseInt($('#rocket').css('left'));
  var shipTop = parseInt($('#rocket').css('top'));
  var speedFractionX = parseFloat($('#rocket').css('transform').split(",")[1])
  var speedFractionY = parseFloat($('#rocket').css('transform').split(",")[3])

  var rocket = new Image();
  rocket.src = "rocket.png";


  // Fadeout instructions after 7 seconds
  setTimeout(function(){
    $('.instructions').fadeOut(2000);
  },5000)


  // Defining keyboard inputs
  $(document).on('keydown', function(event) {
    var key = String.fromCharCode(event.which);
    shipLeft = parseInt($('#rocket').css('left'));
    shipTop = parseInt($('#rocket').css('top'));
    console.log(event.which);
    if (key === "W") {
      speed += 20;
    } else if(key === "S") {
      speed -= 20;
    } else if(key === "A") {
      degree -= 15;
      $('#rocket').css("transform", 'rotateZ(' + degree + 'deg)');
    } else if(key === "D") {
      degree += 15;
      $('#rocket').css("transform", 'rotateZ(' + degree + 'deg)');
    }
    if (event.which == 32 && cooldown === false) {
      bullets.push(new Bullet(10,50));
      cooldown = true;
      setTimeout(function(){
        cooldown = false;
      }, 100)
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
    } else if ((parseInt($('#rocket').css('left')) > ($(window).width()-87)) && speedFractionX > 0) {
      speedFractionX = 0;
    }
    if ((parseInt($('#rocket').css('top')) < 0) && speedFractionY > 0)  {
      speedFractionY = 0;
    } else if ((parseInt($('#rocket').css('top')) > ($(window).height()-87)) && speedFractionY < 0) {
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

    for(var i = 0; i < asteroids.length; i++) {
        asteroids[i].move();
        asteroids[i].draw();
    }

    for(var i = 0; i < bullets.length; i++) {
      bullets[i].move();
      bullets[i].draw();
    }

    $( document ).on( "mousemove", function( event ) {
      var mouseShipDiffX = event.pageX - (shipLeft + 20);
      var mouseShipDiffY = event.pageY - (shipTop + 20);
      var angle = Math.atan(mouseShipDiffX/mouseShipDiffY) * -60;
      if (mouseShipDiffY > 0) { angle += 180};
      $('#rocket').css("transform", 'rotateZ(' + angle + 'deg)');
    });


  },50)
}
  })


  var canvas = document.getElementById("game-canvas"),
      ctx = canvas.getContext("2d");

  var W = $(window).width(),
      H = $(window).height();

  canvas.height = H; canvas.width = W;


  $('#game-canvas').attr('width',$(window).width());
  $('#game-canvas').attr('height',$(window).height());




});
