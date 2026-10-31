/* Film strip: endless marquee of gallery thumbnails */
(function (App) {
  "use strict";

  App.modules.strip = function () {
    var track = App.$(".strip__track");
    var stripImgs = (App.data.gallery || []).map(function (g) { return g.thumb || g.src; });
    // Two copies so the CSS marquee can loop at -50%
    stripImgs.concat(stripImgs).forEach(function (src) {
      var i = App.el("img"); i.src = src; i.alt = ""; i.loading = "lazy"; track.appendChild(i);
    });
  };
})(window.App);
