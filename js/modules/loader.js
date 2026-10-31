/* Loader: film leader 3-2-1, waits for the first hero image */
(function (App) {
  "use strict";

  App.modules.loader = function (firstSlide) {
    function ready() { document.body.classList.add("is-ready"); document.body.classList.remove("is-loading"); }
    if (App.reduce) return ready();

    var num = App.$(".leader__num"), n = 3;
    var firstLoaded = new Promise(function (res) {
      var img = firstSlide;
      if (!img || img.complete) return res();
      img.addEventListener("load", res); img.addEventListener("error", res);
      setTimeout(res, 3500);
    });
    var counted = new Promise(function (res) {
      var iv = setInterval(function () {
        n--; if (n <= 0) { clearInterval(iv); return res(); }
        num.textContent = n;
      }, 700);
    });
    Promise.all([firstLoaded, counted]).then(ready);
  };
})(window.App);
