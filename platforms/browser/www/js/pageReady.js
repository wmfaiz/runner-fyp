jQuery(window).on("load", function() {
  move();
  // $("#loading").css("animation", "LoadingColor ease-in-out 1s forwards");
  $(".SplashScreen .AppTitle h2").css(
    "animation",
    "AppTitleAnimateSmall ease-in-out 2s forwards"
  );
  $(".SplashScreen .AppTitle hr").css(
    "animation",
    "AppTitleAnimateHr ease-in-out 3.5s forwards"
  );
  $(".SplashScreen .AppTitle h1").css(
    "animation",
    "AppTitleAnimateBig ease-in-out 2s forwards"
  );
  // $(".SplashScreen").css("animation", "AppTitleFadeAway ease-in-out 5s forwards");
  $(".SplashScreen").fadeTo(2000, 0, function() {
    $(".SplashScreen").hide();
    $("#loading").hide("fast");
  });
});

function move() {
  let elem = document.getElementById("loading");
  let width = 10;
  var id = setInterval(frame, 20);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      // elem.style.width = width + "%";
      elem.innerHTML = width + "%";
    }
  }
}
