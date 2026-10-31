/* Custom cursor + magnetic buttons (mouse users, motion allowed) */
(function (App) {
  "use strict";

  App.modules.cursor = function () {
    if (!App.finePointer || App.reduce) return;
    var cur = App.$(".cursor"), label = App.$(".cursor__label"), cx = 0, cy = 0, mx = 0, my = 0;
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; cur.classList.add("is-on"); });
    document.addEventListener("mouseleave", function () { cur.classList.remove("is-on"); });
    (function move() {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cur.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(move);
    })();
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest("[data-cursor]");
      if (t) { label.textContent = t.dataset.cursor; cur.classList.add("is-big"); }
      else cur.classList.remove("is-big");
    });
    // Runs after contact so its generated .btn links are included
    App.$$(".btn, .nav__cta").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.25 + "px," + (e.clientY - r.top - r.height / 2) * 0.35 + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  };
})(window.App);
