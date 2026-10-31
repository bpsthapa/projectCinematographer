/* About: career path list */
(function (App) {
  "use strict";

  App.modules.about = function () {
    var pathEl = App.$(".path");
    (App.data.path || []).forEach(function (p) {
      pathEl.appendChild(App.el("li", null, "<h3>" + App.esc(p.title) + "</h3><p>" + App.esc(p.text) + "</p>"));
    });
  };
})(window.App);
