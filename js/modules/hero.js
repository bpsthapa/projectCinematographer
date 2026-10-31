/* Hero: viewfinder slideshow, running timecode, letter-split name */
(function (App) {
  "use strict";
  var $ = App.$, $$ = App.$$, el = App.el;

  App.modules.hero = function () {
    var S = App.data;

    // Slideshow
    var slidesWrap = $(".hero__slides");
    var slides = (S.hero || []).map(function (s, i) {
      var img = el("img", "hero__slide");
      img.src = s.src; img.alt = ""; img.decoding = "async";
      if (i > 0) img.loading = "lazy";
      slidesWrap.appendChild(img);
      return img;
    });
    var needle = $(".vf__needle"), clipEl = $(".vf__clip"), current = 0;
    function showSlide(i) {
      var prev = slides[current];
      if (prev && prev !== slides[i]) { prev.classList.remove("is-active"); prev.classList.add("is-leaving"); setTimeout(function () { prev.classList.remove("is-leaving"); }, 1500); }
      current = i;
      slides[i].classList.add("is-active");
      var d = S.hero[i];
      needle.style.left = (d.focus * 100) + "%";
      clipEl.textContent = d.clip;
    }
    if (slides.length) {
      showSlide(0);
      if (!App.reduce && slides.length > 1) setInterval(function () { showSlide((current + 1) % slides.length); }, 6500);
    }

    // Running timecode at 24 fps
    var tc = $(".vf__tc"), t0 = performance.now();
    function pad(n) { return n < 10 ? "0" + n : "" + n; }
    (function tick(now) {
      var f = Math.floor((now - t0) / (1000 / 24));
      var ff = f % 24, s = Math.floor(f / 24);
      tc.textContent = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60) + ":" + pad(ff);
      requestAnimationFrame(tick);
    })(t0);

    // Split hero name into letters
    $$(".hero__name .line").forEach(function (line, li) {
      var text = line.textContent, ci = 0; line.textContent = "";
      text.split(" ").forEach(function (word, wi) {
        if (wi) line.appendChild(document.createTextNode(" "));
        var w = el("span", "hero__word"); w.setAttribute("aria-hidden", "true");
        word.split("").forEach(function (ch) {
          var c = el("span", "char"); c.textContent = ch;
          c.style.transitionDelay = (0.55 + li * 0.18 + (ci++) * 0.035) + "s";
          w.appendChild(c);
        });
        line.appendChild(w);
      });
    });

    return { firstSlide: slides[0] };
  };
})(window.App);
