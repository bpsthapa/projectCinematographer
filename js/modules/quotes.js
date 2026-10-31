/* Quotes: words light up as the quote scrolls through the viewport */
(function (App) {
  "use strict";

  App.modules.quotes = function () {
    var quotesEl = App.$(".quotes");
    (App.data.quotes || []).forEach(function (q) {
      var b = App.el("blockquote", "quote");
      b.innerHTML = ("“" + q + "”").split(" ").map(function (w) { return '<span class="w">' + App.esc(w) + "</span>"; }).join(" ");
      quotesEl.appendChild(b);
    });
    var quoteEls = App.$$(".quote");

    App.onScroll(function () {
      var vh = window.innerHeight;
      quoteEls.forEach(function (q) {
        var r = q.getBoundingClientRect();
        var p = App.clamp01((vh * 0.85 - r.top) / (r.height + vh * 0.3));
        var words = q.children, lit = Math.round(p * words.length);
        for (var i = 0; i < words.length; i++) words[i].classList.toggle("is-lit", i < lit);
      });
    });
  };
})(window.App);
