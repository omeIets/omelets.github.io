/* GirliES landing: motion e pequenos comportamentos. Sem JS a pagina continua legivel. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var gs = hasGsap ? window.gsap : null;
  var motion = hasGsap && !reduce;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  if (motion) document.documentElement.classList.add("gsap-on");

  /* ---------- texturas decorativas do hero (pixel strip + ASCII) ---------- */
  function seeded(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  function buildStrip() {
    var el = $("[data-strip]"); if (!el) return;
    var rnd = seeded(7), html = "";
    for (var i = 0; i < 90; i++) html += rnd() > 0.42 ? "<i></i>" : "<i style='background:transparent'></i>";
    el.innerHTML = html;
  }

  function buildAscii() {
    var el = $("[data-ascii]"); if (!el) return;
    var rnd = seeded(31), chars = "+#-.  .", lines = [];
    for (var y = 0; y < 90; y++) {
      var row = "";
      for (var x = 0; x < 150; x++) row += chars.charAt(Math.floor(rnd() * chars.length));
      lines.push(row);
    }
    el.textContent = lines.join("\n");
  }

  /* ---------- waffle 10x10 ---------- */
  function buildWaffles() {
    $$("[data-waffle]").forEach(function (w) {
      var html = "";
      for (var i = 0; i < 100; i++) html += "<i></i>";
      w.innerHTML = html;
    });
  }
  function fillWaffle(w) {
    var n = +w.getAttribute("data-waffle"), cells = $$("i", w).slice(0, n);
    if (!motion) { cells.forEach(function (c) { c.classList.add("on"); }); return; }
    var o = { p: 0 };
    gs.to(o, {
      p: 1, duration: 1.3, ease: "power2.out",
      onUpdate: function () {
        var k = Math.round(o.p * cells.length);
        cells.forEach(function (c, i) { c.classList.toggle("on", i < k); });
      }
    });
  }

  /* ---------- contagem ---------- */
  function count(el) {
    var to = +el.getAttribute("data-count");
    if (!motion) { el.textContent = to; return; }
    var o = { v: 0 };
    el.textContent = "0";
    gs.to(o, { v: to, duration: 1.4, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v); } });
  }

  /* ---------- entra na tela: reveal, contadores, waffle ---------- */
  function observeViewport() {
    var targets = $$("[data-reveal]");
    var order = new Map();
    targets.forEach(function (el) {
      var parent = el.parentElement, i = order.get(parent) || 0;
      el.style.setProperty("--d", Math.min(i * 0.07, 0.35) + "s");
      order.set(parent, i + 1);
    });
    function reveal(el) {
      el.classList.add("is-in");
      $$("[data-count]", el).forEach(count);
      $$("[data-waffle]", el).forEach(fillWaffle);
    }
    if (!("IntersectionObserver" in window)) { targets.forEach(reveal); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target); reveal(e.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- hero: titulo palavra a palavra + entrada ---------- */
  function splitWords(title) {
    var spans = [];
    function walk(node, parent) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"), i = document.createElement("span");
            w.className = "split-w"; w.setAttribute("aria-hidden", "true");
            i.textContent = part; w.appendChild(i); parent.appendChild(w); spans.push(i);
          });
        } else if (n.nodeType === 1) {
          var c = n.cloneNode(false); parent.appendChild(c); walk(n, c);
        }
      });
    }
    var frag = document.createDocumentFragment();
    walk(title, frag);
    title.setAttribute("aria-label", title.textContent);
    title.textContent = ""; title.appendChild(frag);
    return spans;
  }

  function heroIntro() {
    var title = $("[data-split]"); if (!title) return;
    var fades = $$("[data-fade]");
    if (!motion) { fades.forEach(function (e) { e.classList.add("is-in"); }); return; }

    var girl = $(".hero__girl"), peng = $(".hero__peng"), sticker = $(".sticker");
    var spans = splitWords(title);
    var tl = gs.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
    tl.fromTo(spans, { yPercent: 108 }, { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0);
    tl.fromTo(fades, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.5);
    if (girl) tl.fromTo(girl, { y: 90, opacity: 0, scale: 0.92, transformOrigin: "50% 100%" }, { y: 0, opacity: 1, scale: 1, duration: 1.2 }, 0.2);
    if (peng) tl.fromTo(peng, { x: -60, y: 40, opacity: 0, rotate: -20 }, { x: 0, y: 0, opacity: 1, rotate: 0, duration: 1, ease: "back.out(1.7)" }, 0.7);
    if (sticker) tl.fromTo(sticker, { scale: 0, rotate: -40 }, { scale: 1, rotate: 8, duration: 0.7, ease: "back.out(2)" }, 1.0);
    tl.add(function () {
      if (girl) gs.to(girl, { y: -10, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
      if (peng) gs.to(peng, { y: -8, rotate: -3, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });

    /* o mascote desliza mais devagar que a pagina */
    gs.to(".hero__art", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------- pilha de janelas: a anterior recua quando a proxima chega ---------- */
  function stack() {
    if (!motion) return;
    var cards = $$("[data-stack] .stack__card");
    cards.forEach(function (card, i) {
      var next = cards[i + 1]; if (!next) return;
      gs.to(card, {
        scale: 0.94, opacity: 0.55, ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top " + (80 + (i + 1) * 18) + "px", scrub: true }
      });
    });
  }

  /* ---------- timeline: scroll horizontal pinado no desktop, swipe nativo no toque ---------- */
  function timeline() {
    var tl = $("[data-timeline]"); if (!tl) return;
    var track = $(".tl__track", tl), bar = $("[data-tl-progress]", tl);
    var fine = window.matchMedia("(min-width: 1000px)").matches;

    if (!motion || !fine) {
      if (bar) {
        var upd = function () { var m = tl.scrollWidth - tl.clientWidth; bar.style.transform = "scaleX(" + (m > 0 ? tl.scrollLeft / m : 0) + ")"; };
        tl.addEventListener("scroll", upd, { passive: true }); upd();
      }
      return;
    }

    tl.classList.add("tl--pan");
    var dist = function () { return Math.max(0, track.scrollWidth - tl.clientWidth); };
    gs.fromTo(track, { x: 0 }, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: {
        trigger: tl, start: "top top", end: function () { return "+=" + Math.max(1, dist()); },
        pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (self) { if (bar) bar.style.transform = "scaleX(" + self.progress + ")"; }
      }
    });
  }

  /* ---------- galeria: leve parallax por foto ---------- */
  function gallery() {
    if (!motion) return;
    $$(".gallery .photo").forEach(function (p, i) {
      gs.fromTo(p, { y: 24 + (i % 3) * 14 }, { y: -(10 + (i % 3) * 8), ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }

  /* ---------- final: mascote sobe ---------- */
  function finale() {
    if (!motion) return;
    gs.from(".final__girl", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom bottom", scrub: true } });
  }

  function init() {
    buildStrip(); buildAscii(); buildWaffles();
    if (hasGsap) gs.registerPlugin(window.ScrollTrigger);
    observeViewport();
    heroIntro();
    stack(); timeline(); gallery(); finale();
    if (hasGsap) {
      var refresh = function () { window.ScrollTrigger.refresh(); };
      window.addEventListener("load", refresh);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    }
    watchBreakpoint();
  }

  /* o layout do timeline depende da largura; se cruzar 1000px (girar o tablet, redimensionar), recarrega */
  function watchBreakpoint() {
    var mq = window.matchMedia("(min-width: 1000px)"), wide = mq.matches, t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () { if (mq.matches !== wide) window.location.reload(); }, 250);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
