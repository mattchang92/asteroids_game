$(document).ready(function(){

  // Fadeout instructions after 7 seconds
  setTimeout(function(){
    $('.instructions').fadeOut(2000);
  },5000)

  // Defining variables globally
  var ammo = ["bullet1","bullet2","bullet3"];
  var degree = 0;
  var speed = 0;
  $('#rocket').css('transform','matrix(1, 0, 0, 1, 0, 0)')
  var shipLeft = parseInt($('#rocket').css('left'));
  var shipTop = parseInt($('#rocket').css('top'));
  var bulletLeft = parseInt($('.firing').css('left'));
  var bulletTop = parseInt($('.firing').css('top'));
  var speedFractionX = parseFloat($('#rocket').css('transform').split(",")[1])
  var speedFractionY = parseFloat($('#rocket').css('transform').split(",")[3])
  var currentX;
  var currentY;

  // Defining keyboard inputs
  $(document).on('keydown', function(event) {
    var key = String.fromCharCode(event.which);
    shipLeft = parseInt($('#rocket').css('left'));
    shipTop = parseInt($('#rocket').css('top'));
    if (key === "W") {
      speed += 10;
    } else if(key === "S") {
      speed -= 20;
    } else if(key === "R") {
      $('.bullet').addClass('loaded');
      ammo = ["bullet1","bullet2","bullet3"];
    } else if(key === "A") {
      degree -= 10;
      $('#rocket').css("transform", 'rotateZ(' + degree + 'deg)');
    } else if(key === "D") {
      degree += 10;
      $('#rocket').css("transform", 'rotateZ(' + degree + 'deg)');
    }
    if (event.which == 32) {
      if (ammo.length > 0) {
        var firing = ammo.shift();
        $("#" + firing).addClass('firing');
        $("#" + firing).removeClass('loaded');
        currentX = speedFractionX;
        currentY = speedFractionY;
        var shootingNow = setInterval(function(){
          if (parseInt($(".firing").css('top') < 0)) {
            $(".firing").addClass('loaded');
            $(this).removeClass('firing');
            setTimeout(function(){
              clearInterval(shootingNow);
            },100);
          }
        },50);
      }
    }
  });

  // Clock to control in-game elements
  var gameClockFast = setInterval(function(){
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
    } else if ((parseInt($('#rocket').css('left')) > ($(window).width()-50)) && speedFractionX > 0) {
      speedFractionX = 0;
    }
    if ((parseInt($('#rocket').css('top')) < 0) && speedFractionY > 0)  {
      speedFractionY = 0;
    } else if ((parseInt($('#rocket').css('top')) > ($(window).height()-50)) && speedFractionY < 0) {
      speedFractionY = 0;
    }

    if (parseInt($('.firing').css('top')) < 0) {
      $('*').removeClass('firing');
    } else if (parseInt($('.firing').css('top')) > $(window).height()-10){
      $('*').removeClass('firing');
    } else if (parseInt($('.firing').css('left')) < 0){
      $('*').removeClass('firing');
    } else if (parseInt($('.firing').css('left')) > $(window).width()){
      $('*').removeClass('firing');
    }

    // Calculates ships location in the next clock cycle
    $('#rocket').css("top", shipTop - (speed * speedFractionY));
    $('#rocket').css("left", shipLeft + (speed * speedFractionX));

    $('.firing').css("top", bulletTop - (50 * currentY));
    $('.firing').css("left", bulletLeft + (50 * currentX));
    // Speeding warning
    if (speed > 250) {
      $('#speed').html("Whoa slow down there");
    } else {
      $('#speed').html(speed);
    }

    $('.loaded').css('top',shipTop+30);
    $('.loaded').css('left',shipLeft+20);

    if (ammo.length === 0) {
      $('.shot').css("background-color",'black');
    } else if (ammo.length === 1) {
      $('.shot').css("background-color",'black');
      $('#shot1').css('background-color','white');
    } else if (ammo.length === 2) {
      $('.shot').css("background-color",'white');
      $('#shot3').css('background-color','black');
    } else if (ammo.length === 3) {
      $('.shot').css("background-color",'white');
    }


  },50)

});
