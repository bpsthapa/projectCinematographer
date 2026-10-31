(function () {
  "use strict";
  var S = window.SITE || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  $(".year").textContent = new Date().getFullYear();

  /* ---------------- Hero: viewfinder slideshow ---------------- */
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
    if (!reduce && slides.length > 1) setInterval(function () { showSlide((current + 1) % slides.length); }, 6500);
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

  /* ---------------- Loader: film leader 3-2-1 ---------------- */
  function ready() { document.body.classList.add("is-ready"); document.body.classList.remove("is-loading"); }
  if (reduce) { ready(); }
  else {
    var num = $(".leader__num"), n = 3;
    var firstLoaded = new Promise(function (res) {
      var img = slides[0];
      if (!img || img.complete) return res();
      img.addEventListener("load", res); img.addEventListener("error", res);
      setTimeout(res, 3500);
    });
    var counted = new Promise(function (res) {
      var iv = setInterval(function () {
        n--; if (n <= 0) { clearInterval(iv); return res(); }
        num.textContent = n;
      }, 700);
    });
    Promise.all([firstLoaded, counted]).then(ready);
  }

  /* ---------------- About: career path ---------------- */
  var pathEl = $(".path");
  (S.path || []).forEach(function (p) {
    pathEl.appendChild(el("li", null, "<h3>" + esc(p.title) + "</h3><p>" + esc(p.text) + "</p>"));
  });

  /* ---------------- Quotes ---------------- */
  var quotesEl = $(".quotes");
  (S.quotes || []).forEach(function (q) {
    var b = el("blockquote", "quote");
    b.innerHTML = ("“" + q + "”").split(" ").map(function (w) { return '<span class="w">' + esc(w) + "</span>"; }).join(" ");
    quotesEl.appendChild(b);
  });
  var quoteEls = $$(".quote");
  function lightQuotes() {
    var vh = window.innerHeight;
    quoteEls.forEach(function (q) {
      var r = q.getBoundingClientRect();
      var p = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
      p = Math.max(0, Math.min(1, p));
      var words = q.children, lit = Math.round(p * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle("is-lit", i < lit);
    });
  }

  /* ---------------- Film strip ---------------- */
  var track = $(".strip__track");
  var stripImgs = (S.gallery || []).map(function (g) { return g.thumb || g.src; });
  stripImgs.concat(stripImgs).forEach(function (src) {
    var i = el("img"); i.src = src; i.alt = ""; i.loading = "lazy"; track.appendChild(i);
  });

  /* ---------------- Films ---------------- */
  var list = $(".films__list"), preview = $(".films__preview"), pImg = $("img", preview);
  (S.films || []).forEach(function (f) {
    var li = el("li", "film");
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
  if (finePointer && !reduce) {
    var px = 0, py = 0, tx = 0, ty = 0, on = false;
    $$(".film").forEach(function (li) {
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
  }

  /* ---------------- Gallery + lightbox ---------------- */
  var grid = $(".gallery__grid");
  (S.gallery || []).forEach(function (g, i) {
    var b = el("button", "shot reveal-up");
    b.type = "button"; b.dataset.index = i; b.dataset.cursor = "View";
    b.setAttribute("aria-label", "Open photo: " + g.caption);
    b.innerHTML = '<img src="' + esc(g.thumb || g.src) + '" alt="' + esc(g.caption) + '" loading="lazy"><span class="shot__cap">' + esc(g.caption) + "</span>";
    b.addEventListener("click", function () { openBox(i); });
    grid.appendChild(b);
  });

  var box = $(".lightbox"), bImg = $(".lightbox__figure img"), bCap = $(".lightbox__caption"), bCount = $(".lightbox__count");
  var bi = 0, lastFocus = null;
  function setBox(i) {
    var g = S.gallery; bi = (i + g.length) % g.length;
    bImg.classList.remove("is-loaded");
    bImg.onload = function () { bImg.classList.add("is-loaded"); };
    bImg.src = g[bi].src; bImg.alt = g[bi].caption;
    bCap.textContent = g[bi].caption;
    bCount.textContent = (bi + 1) + " / " + g.length;
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

  /* ---------------- Recognition ---------------- */
  var tl = $(".timeline__list");
  (S.awards || []).forEach(function (a) {
    tl.appendChild(el("li", "award",
      (a.year ? '<span class="award__year">' + esc(a.year) + "</span>" : "") +
      "<h3>" + esc(a.title) + "</h3><p>" + esc(a.text) + "</p>"));
  });
  var tline = $(".timeline__line i"), tWrap = $(".timeline");

  /* ---------------- Contact ---------------- */
  var c = S.contact || {}, links = $(".contact__links"), any = false;
  function addBtn(href, label, primary, ext) {
    var a = el("a", "btn" + (primary ? " btn--primary" : ""));
    a.href = href; a.textContent = label;
    if (ext) { a.target = "_blank"; a.rel = "noopener"; }
    links.appendChild(a); any = true;
  }
  if (c.email) addBtn("mailto:" + c.email, "Send an email", true);
  if (c.phone) addBtn("tel:" + c.phone.replace(/\s+/g, ""), "Call", false);
  if (c.whatsapp) addBtn("https://wa.me/" + c.whatsapp.replace(/\D/g, ""), "WhatsApp", false, true);
  if (c.instagram) addBtn(c.instagram, "Instagram", false, true);
  if (c.facebook) addBtn(c.facebook, "Facebook", false, true);
  if (!any) addBtn("https://neftanepal.org.np/krishna-thapa/", "View NEFTA profile", true, true);

  /* ---------------- Split headings ---------------- */
  $$(".split").forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", h.textContent.trim());
    h.innerHTML = words.map(function (w, i) {
      return '<span class="word" aria-hidden="true"><span style="transition-delay:' + (i * 0.07) + 's">' + esc(w) + "</span></span>";
    }).join(" ");
  });

  /* ---------------- Reveal on scroll ---------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  $$(".split, .reveal-clip, .reveal-up, .award, .contact").forEach(function (n) { io.observe(n); });

  /* ---------------- Nav ---------------- */
  var nav = $(".nav"), toggle = $(".nav__toggle"), menu = $(".nav__menu"), lastY = 0;
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
    document.body.style.overflow = open ? "" : "hidden";
  });
  $$("a", menu).forEach(function (a) {
    a.addEventListener("click", function () {
      toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("is-open"); document.body.style.overflow = "";
    });
  });
  var sections = $$("main section[id]");
  var navIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      $$("a", menu).forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(function (s) { navIO.observe(s); });

  /* ---------------- Scroll-linked effects ---------------- */
  var bar = $(".progress span"), ticking = false;
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    nav.classList.toggle("is-solid", y > 60);
    nav.classList.toggle("is-hidden", y > window.innerHeight && y > lastY && !menu.classList.contains("is-open"));
    lastY = y;
    lightQuotes();
    var r = tWrap.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.max(0, Math.min(1, (vh * 0.7 - r.top) / r.height));
    tline.style.transform = "scaleY(" + p + ")";
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------------- Custom cursor + magnetic buttons ---------------- */
  if (finePointer && !reduce) {
    var cur = $(".cursor"), label = $(".cursor__label"), cx = 0, cy = 0, mx = 0, my = 0;
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; cur.classList.add("is-on"); });
    document.addEventListener("mouseleave", function () { cur.classList.remove("is-on"); });
    (function move() {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cur.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(move);
    })();
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest("[data-cursor]");
      if (t) { label.textContent = t.dataset.cursor; cur.classList.add("is-big"); }
      else cur.classList.remove("is-big");
    });
    $$(".btn, .nav__cta").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.25 + "px," + (e.clientY - r.top - r.height / 2) * 0.35 + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }
})();
