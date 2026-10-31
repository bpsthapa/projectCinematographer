/* Recognition: awards timeline with a scroll-drawn line */
(function (App) {
  "use strict";

  App.modules.recognition = function () {
    var tl = App.$(".timeline__list"), esc = App.esc;
    (App.data.awards || []).forEach(function (a) {
      tl.appendChild(App.el("li", "award",
        (a.year ? '<span class="award__year">' + esc(a.year) + "</span>" : "") +
        "<h3>" + esc(a.title) + "</h3><p>" + esc(a.text) + "</p>"));
    });

    var tline = App.$(".timeline__line i"), tWrap = App.$(".timeline");
    App.onScroll(function () {
      var r = tWrap.getBoundingClientRect(), vh = window.innerHeight;
      tline.style.transform = "scaleY(" + App.clamp01((vh * 0.7 - r.top) / r.height) + ")";
    });
  };
})(window.App);
