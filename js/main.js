/* ==========================================================
   Boot: starts each module in order. Content modules first,
   then the ones that act on what they generated (reveal,
   cursor), then the shared scroll loop.
   New section? Add js/modules/<name>.js, a <script> tag in
   index.html, and one line here.
   ========================================================== */
(function (App) {
  "use strict";
  var M = App.modules;

  var hero = M.hero();
  M.loader(hero.firstSlide);

  M.about();
  M.quotes();
  M.strip();
  M.films();
  M.gallery();
  M.recognition();
  M.contact();

  M.reveal();
  M.nav();
  M.cursor();

  App.startScroll();
})(window.App);
