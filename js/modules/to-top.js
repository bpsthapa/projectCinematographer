/* Back-to-top button: appears after the hero, ring shows scroll progress,
   click "rewinds" to the top (reel spins until the top is reached). */
(function (App) {
  "use strict";

  App.modules.toTop = function () {
    var btn = App.$(".to-top"), ring = App.$(".to-top__progress"), stopTimer;

    function stopRewind() { clearTimeout(stopTimer); btn.classList.remove("is-rewinding"); }

    btn.addEventListener("click", function () {
      btn.classList.add("is-rewinding");
      clearTimeout(stopTimer); stopTimer = setTimeout(stopRewind, 3000); // safety net
      window.scrollTo({ top: 0, behavior: App.reduce ? "auto" : "smooth" });
      // Keep keyboard users at the top of the page too
      App.$(".nav__mark").focus({ preventScroll: true });
    });

    App.onScroll(function () {
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      if (y < 4) stopRewind();
      // Stay visible while rewinding so the reel can be seen spinning
      btn.classList.toggle("is-shown", y > window.innerHeight * 0.8 || btn.classList.contains("is-rewinding"));
      ring.style.strokeDashoffset = String(100 - (h > 0 ? y / h : 0) * 100);
    });
  };
})(window.App);
