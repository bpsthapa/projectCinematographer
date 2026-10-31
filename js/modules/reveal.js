/* Split headings into words + reveal elements as they scroll into view */
(function (App) {
  "use strict";

  App.modules.reveal = function () {
    App.$$(".split").forEach(function (h) {
      var words = h.textContent.trim().split(/\s+/);
      h.setAttribute("aria-label", h.textContent.trim());
      h.innerHTML = words.map(function (w, i) {
        return '<span class="word" aria-hidden="true"><span style="transition-delay:' + (i * 0.07) + 's">' + App.esc(w) + "</span></span>";
      }).join(" ");
    });

    // Run after the content modules so generated .reveal-up / .award items are observed
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    App.$$(".split, .reveal-clip, .reveal-up, .award, .contact").forEach(function (n) { io.observe(n); });
  };
})(window.App);
