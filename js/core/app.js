/* ==========================================================
   App namespace + shared helpers. Loaded before every module.
   Modules register themselves on App.modules and are started
   in order by js/main.js.
   ========================================================== */
(function () {
  "use strict";
  var App = window.App = { modules: {} };

  App.data = window.SITE || {};
  App.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  App.finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  App.$ = function (s, r) { return (r || document).querySelector(s); };
  App.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  App.el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  App.esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  App.clamp01 = function (v) { return Math.max(0, Math.min(1, v)); };

  /* One rAF-throttled scroll/resize loop shared by all modules.
     Register with App.onScroll(fn); fn runs on scroll, resize and once at start. */
  var handlers = [], ticking = false;
  function run() { handlers.forEach(function (fn) { fn(); }); ticking = false; }
  App.onScroll = function (fn) { handlers.push(fn); };
  App.startScroll = function () {
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    window.addEventListener("resize", run);
    run();
  };
})();
