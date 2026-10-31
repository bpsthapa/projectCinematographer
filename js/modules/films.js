/* Films: list rows + floating poster preview that follows the mouse */
(function (App) {
  "use strict";
  var $ = App.$, esc = App.esc;

  App.modules.films = function () {
    var list = $(".films__list"), preview = $(".films__preview"), pImg = $("img", preview);
    (App.data.films || []).forEach(function (f) {
      var li = App.el("li", "film");
      li.innerHTML =
        '<img class="film__thumb" alt="" loading="lazy">' +
        '<h3 class="film__title">' + esc(f.title) + "</h3>" +
        '<div class="film__meta">' + (f.year ? "<strong>" + esc(f.year) + "</strong>" : "") + esc(f.note || "") + "</div>";
      var thumb = $(".film__thumb", li);
      if (f.poster) {
        thumb.src = f.poster;
        thumb.addEventListener("error", function () { thumb.style.visibility = "hidden"; li.dataset.noPoster = "1"; });
        li.dataset.poster = f.poster;
      }
      list.appendChild(li);
    });

    if (!App.finePointer || App.reduce) return;
    var px = 0, py = 0, tx = 0, ty = 0, on = false;
    App.$$(".film").forEach(function (li) {
      li.addEventListener("mouseenter", function () {
        if (!li.dataset.poster || li.dataset.noPoster) return;
        pImg.src = li.dataset.poster; preview.classList.add("is-on"); on = true;
      });
      li.addEventListener("mouseleave", function () { preview.classList.remove("is-on"); on = false; });
    });
    window.addEventListener("mousemove", function (e) { tx = e.clientX + 140; ty = e.clientY; });
    (function follow() {
      px += (tx - px) * 0.14; py += (ty - py) * 0.14;
      if (on) preview.style.left = px + "px", preview.style.top = py + "px";
      requestAnimationFrame(follow);
    })();
  };
})(window.App);
