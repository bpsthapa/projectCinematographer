/* Film strip: endless marquee of gallery thumbnails.
   The picture at the centre of the screen is shown in colour. */
(function (App) {
  "use strict";

  App.modules.strip = function () {
    var strip = App.$(".strip"), track = App.$(".strip__track");
    var stripImgs = (App.data.gallery || []).map(function (g) { return g.thumb || g.src; });
    // Two copies so the CSS marquee can loop at -50%
    stripImgs.concat(stripImgs).forEach(function (src) {
      var i = App.el("img"); i.src = src; i.alt = ""; i.loading = "lazy"; track.appendChild(i);
    });
    var imgs = App.$$("img", track), centre = null;

    function markCentre() {
      var mid = window.innerWidth / 2, hit = null;
      for (var i = 0; i < imgs.length; i++) {
        var r = imgs[i].getBoundingClientRect();
        if (r.left <= mid && r.right >= mid) { hit = imgs[i]; break; }
      }
      if (hit && hit !== centre) {
        if (centre) centre.classList.remove("is-center");
        hit.classList.add("is-center");
        centre = hit;
      }
    }

    // Track the centre every frame, but only while the strip is on screen
    var visible = false;
    function loop() { if (!visible) return; markCentre(); requestAnimationFrame(loop); }
    new IntersectionObserver(function (entries) {
      var was = visible; visible = entries[0].isIntersecting;
      if (visible && !was) loop();
    }).observe(strip);
    window.addEventListener("resize", markCentre);
  };
})(window.App);
