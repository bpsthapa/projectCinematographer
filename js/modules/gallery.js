/* Gallery grid (darkroom reveal, hover tilt + viewfinder) + lightbox (keyboard, swipe, focus trap) */
(function (App) {
  "use strict";
  var $ = App.$, $$ = App.$$, esc = App.esc;
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  App.modules.gallery = function () {
    var items = App.data.gallery || [];
    var grid = $(".gallery__grid");
    items.forEach(function (g, i) {
      var b = App.el("button", "shot reveal-up");
      b.type = "button"; b.dataset.index = i; b.dataset.cursor = "View";
      b.setAttribute("aria-label", "Open photo: " + g.caption);
      b.style.setProperty("--d", (i % 3) * 0.12 + "s"); // cascade across the columns
      b.innerHTML = '<img src="' + esc(g.thumb || g.src) + '" alt="' + esc(g.caption) + '" loading="lazy">' +
        '<span class="shot__frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
        '<span class="shot__no" aria-hidden="true">' + pad2(i + 1) + " / " + pad2(items.length) + "</span>" +
        '<span class="shot__cap">' + esc(g.caption) + "</span>";
      b.addEventListener("click", function () { openBox(i); });
      if (App.finePointer && !App.reduce) {
        b.addEventListener("mousemove", function (e) {
          var r = b.getBoundingClientRect();
          b.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2) + "deg");
          b.style.setProperty("--rx", (((e.clientY - r.top) / r.height - 0.5) * -10).toFixed(2) + "deg");
        });
        b.addEventListener("mouseleave", function () { b.style.setProperty("--rx", "0deg"); b.style.setProperty("--ry", "0deg"); });
      }
      grid.appendChild(b);
    });

    var box = $(".lightbox"), bImg = $(".lightbox__figure img"), bCap = $(".lightbox__caption"), bCount = $(".lightbox__count");
    var bi = 0, lastFocus = null;
    function setBox(i) {
      bi = (i + items.length) % items.length;
      bImg.classList.remove("is-loaded");
      bImg.onload = function () { bImg.classList.add("is-loaded"); };
      bImg.src = items[bi].src; bImg.alt = items[bi].caption;
      bCap.textContent = items[bi].caption;
      bCount.textContent = (bi + 1) + " / " + items.length;
    }
    function openBox(i) {
      lastFocus = document.activeElement;
      box.hidden = false; setBox(i);
      requestAnimationFrame(function () { box.classList.add("is-open"); });
      document.body.style.overflow = "hidden";
      $(".lightbox__close").focus();
    }
    function closeBox() {
      box.classList.remove("is-open");
      setTimeout(function () { box.hidden = true; }, 400);
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    $(".lightbox__close").addEventListener("click", closeBox);
    $(".lightbox__nav--prev").addEventListener("click", function () { setBox(bi - 1); });
    $(".lightbox__nav--next").addEventListener("click", function () { setBox(bi + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) closeBox(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") closeBox();
      if (e.key === "ArrowLeft") setBox(bi - 1);
      if (e.key === "ArrowRight") setBox(bi + 1);
      if (e.key === "Tab") { // keep focus inside
        var f = $$("button", box), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var sx = null;
    box.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) setBox(bi + (dx < 0 ? 1 : -1)); sx = null;
    });
  };
})(window.App);
