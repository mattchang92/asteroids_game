$(document).ready(function(){
  $('#level-display').css('left',$(window).width()*0.9);

  // Defining variables globally
  var canvas = document.getElementById("game-canvas");
  var ctx = canvas.getContext("2d");
  var direction = [1,-1];
  var asteroids = [];
  var bullets = [];
  var degree = 0;
  var speed = 0;
  var cooldown = false;
  var shipLeft;
  var shipTop;
  var bulletLeft ;
  var bulletTop ;
  var speedFractionX;
  var speedFractionY ;
  var rocket = new Image();
  rocket.src = "rocket.png";
  var shipWidth = 50;
  var shipHeight = 87;
  var gameOver = false;
  var gameStart = false;
  var level = 1;

  // Setting up game canvas dimensions
  canvas.height = $(window).height();
  canvas.width = $(window).width();


  // Game starts on pressing K
    $(document).on('keydown', function(event) {
      if (!gameStart) {
      var start = String.fromCharCode(event.which);
      if (start === "K") {

        gameStart = true;
        // Fadeout instructions after 7 seconds
        setTimeout(function(){
          $('.instructions').fadeOut(2000);
        },10000)

        // Define an Asteroid constructor
        function Asteroid(radius, speedX, speedY) {
          this.radius = radius;
          this.x = Math.random()* parseInt($(window).width());
          this.y = -100;
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
          this.y = parseInt($('#rocket').css('top'))+35;
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



        // Function to create asteroids at set interval
        setInterval(function(){
          asteroids.push(new Asteroid(Math.random()*20 + 20, Math.random()* 5 * direction[Math.round(Math.random())], Math.random()* 5   * direction[Math.round(Math.random())]));
        }, 1000 );

        // Levels/Difficulty still a work in progress
        // var n = 0, time = 10000;
        // for (var i=1; i<30; i++) {
        //   setTimeout(function(){
        //       setInterval(function(){
        //         asteroids.push(new Asteroid(Math.random()*20 + 20, Math.random()* 5 * direction[Math.round(Math.random())], Math.random()* 5   * direction[Math.round(Math.random())]));
        //       }, 2000 );
        //       n++;
        //       $('#level').html(level++);
        //   }, time * i);
        // }


        // Defining keyboard inputs
        $(document).on('keydown', function(event) {
          var key = String.fromCharCode(event.which);

          // controls ship speed
          if (key === "W" && speed < 100) {
            speed += 20;
          } else if(key === "S" && speed > -40) {
            speed -= 20;
          }

          // Limits gun fire-rate to prevent spamming
          if (event.which == 32 && cooldown === false) {
            bullets.push(new Bullet(5,15));
            cooldown = true;
            setTimeout(function(){
              cooldown = false;
            }, 200)
          }
        });

        // Function to detect bullet-asteroid collision
        function bulletCollisionDetection() {
          for (var a=0; a<asteroids.length; a++) {
            for (var b=0; b<bullets.length; b++) {
              if (bullets[b].x > asteroids[a].x-5 && bullets[b].x < asteroids[a].x+5+2*asteroids[a].radius && bullets[b].y > asteroids[a].y-10 && bullets[b].y < asteroids[a].y+5 + 2*asteroids[a].radius){
                asteroids.splice(a,1);
                bullets.splice(b,1);
              }
            }
          }
        }

        // Ship/asteroid collision still a work in progress
        // function shipCollisionDetection() {
        //   shipLeft = parseInt($('#rocket').css('left'));
        //   shipTop = parseInt($('#rocket').css('top'));
        //   for (var a=0; a<asteroids.length; a++) {
        //     if (asteroids[a].y < shipTop + shipHeight)
        //     if (bullets[b].x > asteroids[a].x && bullets[b].x < asteroids[a].x + 2*asteroids[a].radius && bullets[b].y > asteroids[a].y && bullets[b].y < asteroids[a].y + 2*asteroids[a].radius) {
        //       asteroids.splice(a,1);
        //       bullets.splice(b,1);
        //     }
        //   }
        // }


        // Clock to control in-game elements
        var gameClockFast = setInterval(function(){
          // Clears canvas to redraw bullets/asteroids for the next "frame"
          ctx.clearRect(0, 0, $(window).width(), $(window).height());

          // Getting ship's X and Y orientation (as number between -1 and 1)
          speedFractionX = parseFloat($('#rocket').css('transform').split(",")[1]);
          speedFractionY = parseFloat($('#rocket').css('transform').split(",")[3]);
          bulletLeft = parseInt($('.firing').css('left'));
          bulletTop = parseInt($('.firing').css('top'));
          // Getting ship's current X and Y coordinates
          shipLeft = parseInt($('#rocket').css('left'));
          shipTop = parseInt($('#rocket').css('top'));

          // Stops the rocket at the edges of the screen (eg. Rocket is outside bounds of screen AND facing outside)
          if ((parseInt($('#rocket').css('left')) < 0) && speedFractionX < 0)  {
            speedFractionX = 0;
          } else if ((parseInt($('#rocket').css('left')) > ($(window).width()-87)) && speedFractionX > 0) {
            speedFractionX = 0;
          } else if  ((parseInt($('#rocket').css('left')) < 0) && (speedFractionX > 0 && speed < 0)) {
            speedFractionX = 0;
          } else if ((parseInt($('#rocket').css('left')) > ($(window).width()-87)) && (speedFractionX < 0 && speed < 0)) {
            speedFractionX = 0;
          }

          // Prevents rocket from leaving screen when going backwards
          if ((parseInt($('#rocket').css('top')) < 0) && speedFractionY > 0)  {
            speedFractionY = 0;
          } else if ((parseInt($('#rocket').css('top')) > ($(window).height()-87)) && speedFractionY < 0) {
            speedFractionY = 0;
          } else if  ((parseInt($('#rocket').css('top')) < 0) && (speedFractionY < 0 && speed < 0)) {
            speedFractionY = 0;
          } else if ((parseInt($('#rocket').css('top')) > ($(window).height()-87)) && (speedFractionY > 0 && speed < 0)) {
            speedFractionY = 0;
          }


          // Calculates ships location in the next clock cycle
          $('#rocket').css("top", shipTop - (speed * speedFractionY));
          $('#rocket').css("left", shipLeft + (speed * speedFractionX));

          // Displays ship's speed
          $('#speed').html(speed);

          // Calls the bullet-asteroid collision detection function
          bulletCollisionDetection();

          // Removes bullets from existence once they leave the perimeter of the screen
          for(var i = 0; i < bullets.length; i++) {
            if (bullets[i].x > $(window).width() || bullets[i].x < 0 || bullets[i].y < 0 || bullets[i].y > $(window).height()) {
              bullets.splice(i,1);
            }
          }

          // Moves/redraws asteroids for next frame
          for(var i = 0; i < asteroids.length; i++) {
              asteroids[i].move();
              asteroids[i].draw();
          }

          // Moves/redraws bullets for next frame
          for(var i = 0; i < bullets.length; i++) {
            bullets[i].move();
            bullets[i].draw();
          }

          // Aims ship based on difference between mouse cursor location and ship location
          $( document ).on( "mousemove", function( event ) {
            var mouseShipDiffX = event.pageX - (shipLeft + 20);
            var mouseShipDiffY = event.pageY - (shipTop + 20);
            if (Math.sqrt(mouseShipDiffY*mouseShipDiffY + mouseShipDiffX*mouseShipDiffX) < 50) {
              $('#warning').css('visibility', 'visible');
            } else {
              var angle = Math.atan(mouseShipDiffX/mouseShipDiffY) * (-180/Math.PI);
              if (mouseShipDiffY > 0) { angle += 180};
              $('#warning').css('visibility', 'hidden');
              $('#rocket').css("transform", 'rotateZ(' + angle + 'deg)');
            }
          });

        },40)
      }
    }
  })
});
