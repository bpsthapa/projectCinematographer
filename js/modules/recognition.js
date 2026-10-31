/* Recognition: awards timeline; a spark draws the line and lights each award as it passes */
(function (App) {
  "use strict";

  App.modules.recognition = function () {
    var tl = App.$(".timeline__list"), esc = App.esc;
    (App.data.awards || []).forEach(function (a) {
      tl.appendChild(App.el("li", "award",
        '<span class="award__dot"></span><span class="award__tick"></span>' +
        (a.year ? '<span class="award__year"><span>' + esc(a.year) + "</span></span>" : "") +
        "<h3><span>" + esc(a.title) + "</span></h3><p>" + esc(a.text) + "</p>"));
    });

    // The line is drawn up to 70% of the screen height; each award lights up
    // when that tip passes its dot (and dims again when scrolling back up).
    var tWrap = App.$(".timeline"), awards = App.$$(".award", tl);
    App.onScroll(function () {
      var r = tWrap.getBoundingClientRect(), tip = window.innerHeight * 0.7;
      var p = App.clamp01((tip - r.top) / r.height);
      tWrap.style.setProperty("--p", p.toFixed(4));
      tWrap.classList.toggle("is-drawing", p > 0 && p < 1);
      awards.forEach(function (li) {
        var dot = li.firstChild.getBoundingClientRect();
        li.classList.toggle("is-in", dot.top + dot.height / 2 < tip);
      });
    });
  };
})(window.App);
