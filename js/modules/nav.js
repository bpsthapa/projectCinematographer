/* Nav: mobile menu, active link, hide on scroll down, scroll progress bar */
(function (App) {
  "use strict";
  var $ = App.$, $$ = App.$$;

  App.modules.nav = function () {
    var nav = $(".nav"), toggle = $(".nav__toggle"), menu = $(".nav__menu"), lastY = 0;
    function closeMenu() { toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("is-open"); document.body.style.overflow = ""; }
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", closeMenu); });

    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$("a", menu).forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { navIO.observe(s); });

    var bar = $(".progress span");
    App.onScroll(function () {
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
      nav.classList.toggle("is-solid", y > 60);
      nav.classList.toggle("is-hidden", y > window.innerHeight && y > lastY && !menu.classList.contains("is-open"));
      lastY = y;
    });
  };
})(window.App);
