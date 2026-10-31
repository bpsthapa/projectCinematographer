/* Films: stacking card list + sticky "monitor" that shows the active film's poster.
   Cards stick and pile up while scrolling; the newest card in the stack is active
   (or the hovered one). Covered cards shrink and darken slightly. */
(function (App) {
  "use strict";
  var $ = App.$, el = App.el, esc = App.esc;
  var REEL = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="6.6" r="2.1"/><circle cx="12" cy="17.4" r="2.1"/><circle cx="6.6" cy="12" r="2.1"/><circle cx="17.4" cy="12" r="2.1"/></svg>';

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  App.modules.films = function () {
    var films = App.data.films || [];
    var list = $(".films__list"), screen = $(".monitor__screen");
    var mIndex = $(".monitor__index"), mBadge = $(".monitor__badge"), mTitle = $(".monitor__title");
    var cards = [], slides = [], active = -1;

    $(".films__count span").textContent = "Selected feature work · " + pad2(films.length);

    function fallback(f) { return el("div", "monitor__fallback", esc(f.title)); }

    films.forEach(function (f, i) {
      var tags = (f.year ? [f.year] : []).concat(f.tags || []);
      var li = el("li", "film",
        '<span class="film__icon">' + REEL + "</span>" +
        '<img class="film__thumb" alt="" loading="lazy">' +
        '<div class="film__body"><h3 class="film__title">' + esc(f.title) + "</h3>" +
        (f.note ? '<p class="film__note">' + esc(f.note) + "</p>" : "") +
        (tags.length ? '<ul class="film__tags">' + tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "") +
        "</div>" +
        '<span class="film__num">' + pad2(i + 1) + "<i></i></span>");
      li.style.setProperty("--i", i);
      list.appendChild(li);
      cards.push(li);

      // Monitor slide: poster, or a typographic card if there is none / it fails to load
      var thumb = $(".film__thumb", li), slide;
      if (f.poster) {
        thumb.src = f.poster;
        thumb.addEventListener("error", function () { thumb.style.visibility = "hidden"; });
        slide = el("img"); slide.src = f.poster; slide.alt = ""; slide.loading = "lazy";
        slide.addEventListener("error", function () {
          var fb = fallback(f);
          if (i === active) fb.classList.add("is-active");
          screen.replaceChild(fb, slides[i]); slides[i] = fb;
        });
      } else {
        thumb.style.visibility = "hidden";
        slide = fallback(f);
      }
      screen.appendChild(slide);
      slides.push(slide);

      if (App.finePointer) li.addEventListener("mouseenter", function () { setActive(i); });
    });

    function setActive(i) {
      if (i === active) return;
      if (active >= 0) { cards[active].classList.remove("is-active"); slides[active].classList.remove("is-active"); }
      active = i;
      cards[i].classList.add("is-active"); slides[i].classList.add("is-active");
      var f = films[i];
      mIndex.textContent = pad2(i + 1) + " / " + pad2(films.length);
      mBadge.textContent = f.year || "Feature";
      mTitle.textContent = f.title;
    }
    if (!films.length) return;
    setActive(0);

    App.onScroll(function () {
      var rects = cards.map(function (c) { return c.getBoundingClientRect(); });
      // Active: the last card that has moved into the top half of the screen
      var mid = window.innerHeight / 2, best = 0;
      rects.forEach(function (r, i) { if (r.top < mid) best = i; });
      setActive(best);

      if (App.reduce) return;
      // Depth: how much each card is covered by the cards stacked on top of it
      // (offsetHeight is unscaled, so the shrink doesn't feed back into the maths)
      rects.forEach(function (r, i) {
        var h = cards[i].offsetHeight, depth = 0;
        for (var j = i + 1; j < rects.length; j++) depth += App.clamp01((r.top + h - rects[j].top) / h);
        cards[i].style.scale = String(1 - Math.min(depth, 3) * 0.04);
        cards[i].style.setProperty("--dim", String(Math.min(depth, 1.5) * 0.3));
      });
    });
  };
})(window.App);
