/* About: career path timeline (scroll-drawn) + photo parallax and hover tilt */
(function (App) {
  "use strict";

  App.modules.about = function () {
    var pathEl = App.$(".path");
    (App.data.path || []).forEach(function (p) {
      pathEl.appendChild(App.el("li", null, "<h3>" + App.esc(p.title) + "</h3><p>" + App.esc(p.text) + "</p>"));
    });

    // Timeline: draw the line and light up each step as it passes 60% of the screen
    var steps = App.$$("li", pathEl);
    App.onScroll(function () {
      if (!steps.length) return;
      var first = steps[0], last = steps[steps.length - 1];
      var pad = parseFloat(getComputedStyle(first).paddingTop);
      var dot = parseFloat(getComputedStyle(first, "::before").height) / 2;
      var top = first.offsetTop + pad + dot, bottom = last.offsetTop + pad + dot;
      pathEl.style.setProperty("--line-top", top + "px");
      pathEl.style.setProperty("--line-h", (bottom - top) + "px");

      var trigger = window.innerHeight * 0.6, base = pathEl.getBoundingClientRect().top;
      pathEl.style.setProperty("--fill", App.clamp01((trigger - (base + top)) / (bottom - top)).toFixed(3));
      steps.forEach(function (li) { li.classList.toggle("is-reached", base + li.offsetTop + pad + dot < trigger); });
    });

    // Iris reveal, driven by scroll position. (An IntersectionObserver on the photo
    // never fires: it starts clipped to a zero-size circle, so it never "intersects".)
    var photo = App.$(".about__photo"), section = App.$(".about");
    App.onScroll(function () {
      if (!photo.classList.contains("is-in") && section.getBoundingClientRect().top < window.innerHeight * 0.85) photo.classList.add("is-in");
    });

    if (App.reduce) return;

    // Parallax: image drifts inside the frame as it passes through the viewport
    App.onScroll(function () {
      var r = photo.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh; // about -1..1
      photo.style.setProperty("--py", (Math.max(-1, Math.min(1, p)) * -6).toFixed(2) + "%");
    });

    // Hover tilt toward the mouse
    if (!App.finePointer) return;
    photo.addEventListener("mousemove", function (e) {
      var r = photo.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      photo.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
      photo.style.setProperty("--rx", (y * -8).toFixed(2) + "deg");
    });
    photo.addEventListener("mouseleave", function () {
      photo.style.setProperty("--rx", "0deg"); photo.style.setProperty("--ry", "0deg");
    });
  };
})(window.App);
