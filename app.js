/* the museum's machinery.
   Hash routes: #/  #/wing/<key>  #/wing/<key>/<specimen>  #/colophon */

(function () {
  "use strict";

  const D = window.GROVE;
  const S = window.GROVE_SPECIMENS || {};
  const app = document.getElementById("app");

  /* ---------- data assembly ---------- */

  D.wingOrder.forEach((key) => {
    const wing = D.wings[key];
    const stock = S[key] || { shelves: [], items: {} };
    wing.shelves = (stock.shelves || []).filter((row) => row.length);
    wing.specimens = stock.items || {};
  });

  // Catalogue numbers, assigned in walking order.
  let counter = 0;
  D.wingOrder.forEach((key) => {
    const wing = D.wings[key];
    wing.order = [];
    wing.shelves.forEach((row) =>
      row.forEach((id) => {
        const spec = wing.specimens[id];
        if (!spec) return;
        counter += 1;
        spec.no = "RG·" + String(counter).padStart(3, "0");
        wing.order.push(id);
      }),
    );
  });

  /* ---------- small utilities ---------- */

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const escAttr = esc;

  function neighbours(key) {
    const order = D.wingOrder;
    const i = order.indexOf(key);
    return {
      prev: D.wings[order[(i - 1 + order.length) % order.length]],
      next: D.wings[order[(i + 1) % order.length]],
    };
  }

  /* ---------- caption bar (the narration line) ---------- */

  let captionTimer = null;
  function setCaption(text) {
    const el = document.getElementById("caption");
    if (!el) return;
    if (el.textContent === text && el.classList.contains("show")) return;
    clearTimeout(captionTimer);
    el.classList.remove("show");
    captionTimer = setTimeout(() => {
      el.textContent = text;
      el.classList.add("show");
    }, 260);
  }

  /* ---------- scene templates ---------- */

  function captionBar() {
    return '<div class="caption-bar"><span id="caption"></span></div>';
  }

  function wayfinding(current) {
    return (
      '<header class="wayfinding">' +
      '<a href="#/">' +
      esc(D.museum.name) +
      "</a>" +
      '<span class="wf-wing">' +
      esc(current) +
      "</span>" +
      '<a href="#/colophon">Colophon</a>' +
      "</header>"
    );
  }

  function lobbyHTML() {
    const plaques = D.wingOrder
      .map((key) => {
        const w = D.wings[key];
        return (
          '<a class="plaque" href="#/wing/' +
          key +
          '" data-note="Enter the ' +
          escAttr(w.title) +
          '">' +
          '<span class="plaque-no">Wing ' +
          esc(w.numeral) +
          "</span>" +
          '<span class="plaque-title">' +
          esc(w.title) +
          "</span>" +
          '<span class="plaque-note">' +
          esc(w.lobbyNote) +
          "</span>" +
          "</a>"
        );
      })
      .join("");
    return (
      '<div class="scene lobby">' +
      '<span class="lobby-ornament">✦ ✦ ✦</span>' +
      "<h1>" +
      esc(D.museum.name) +
      "</h1>" +
      '<p class="tagline">' +
      esc(D.museum.tagline) +
      "</p>" +
      '<p class="est">' +
      esc(D.museum.established) +
      "</p>" +
      '<hr class="rule">' +
      '<nav class="plaques" aria-label="Wings of the museum">' +
      plaques +
      "</nav>" +
      '<a class="lobby-colophon" href="#/colophon">Colophon &amp; photograph credits</a>' +
      captionBar() +
      "</div>"
    );
  }

  function specimenHTML(wing, id) {
    const s = wing.specimens[id];
    if (!s) return "";
    return (
      '<button class="specimen size-' +
      escAttr(s.size || "medium") +
      " bg-" +
      escAttr(s.bg || "white") +
      '"' +
      ' data-id="' +
      escAttr(id) +
      '"' +
      ' aria-label="' +
      escAttr(s.name + ", " + s.locality + ". Examine.") +
      '">' +
      '<span class="mount"><img src="' +
      escAttr(s.file) +
      '" alt="" draggable="false"></span>' +
      '<span class="plinth">' +
      '<span class="p-name">' +
      esc(s.name) +
      "</span>" +
      '<span class="p-loc">' +
      esc(s.locality) +
      "</span>" +
      "</span>" +
      "</button>"
    );
  }

  const SHELF_ALIGN = {
    minerals: ["center", "left", "right"],
    igneous: ["left", "center", "right"],
    fossils: ["center", "right", "left"],
    meteorites: ["right", "center", "left"],
  };

  function wingHTML(wing) {
    const aligns = SHELF_ALIGN[wing.key] || ["center"];
    const shelves = wing.shelves
      .map((row, i) => {
        const align = row.length <= 2 ? aligns[i % aligns.length] : "center";
        return (
          '<div class="shelf align-' +
          align +
          '">' +
          row.map((id) => specimenHTML(wing, id)).join("") +
          "</div>"
        );
      })
      .join("");
    const nb = neighbours(wing.key);
    return (
      '<div class="scene room mood-' +
      wing.mood +
      '" data-wing="' +
      escAttr(wing.key) +
      '">' +
      wayfinding("Wing " + wing.numeral) +
      '<div class="room-body">' +
      '<aside class="wall-text">' +
      '<span class="wing-no">Wing ' +
      esc(wing.numeral) +
      "</span>" +
      "<h1>" +
      esc(wing.title) +
      "</h1>" +
      wing.intro.map((p) => "<p>" + esc(p) + "</p>").join("") +
      "</aside>" +
      '<div class="case"><div class="case-inner">' +
      shelves +
      '</div><div class="case-glass"></div></div>' +
      "</div>" +
      '<nav class="exits" aria-label="Adjoining rooms">' +
      '<a class="exit exit-left" href="#/wing/' +
      nb.prev.key +
      '">← ' +
      esc(nb.prev.short) +
      "</a>" +
      '<a class="exit exit-right" href="#/wing/' +
      nb.next.key +
      '">' +
      esc(nb.next.short) +
      " →</a>" +
      "</nav>" +
      captionBar() +
      "</div>"
    );
  }

  function examineHTML(wing, id) {
    const s = wing.specimens[id];
    const rows = [
      ["Classification", s.classification],
      ["Origin", s.origin],
      ["Age", s.age],
      ["Composition", s.composition],
      ["Formation", s.formation],
    ]
      .filter((r) => r[1])
      .map(
        (r) =>
          "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>",
      )
      .join("");
    const facts =
      s.facts && s.facts.length
        ? '<div class="label-section"><h3>Points of interest</h3><ul>' +
          s.facts.map((f) => "<li>" + esc(f) + "</li>").join("") +
          "</ul></div>"
        : "";
    const notes = s.notes
      ? '<div class="label-section"><h3>Collector’s notes</h3><p>' +
        esc(s.notes) +
        "</p></div>"
      : "";
    const credit =
      '<p class="label-credit">Photograph: ' +
      esc(s.author) +
      " · " +
      esc(s.license) +
      (s.sourceUrl
        ? ' · <a href="' +
          escAttr(s.sourceUrl) +
          '" target="_blank" rel="noopener">source</a>'
        : "") +
      "</p>";
    return (
      '<div class="examine' +
      (wing.mood === "dark" ? " on-dark" : "") +
      '" role="dialog" aria-modal="true" aria-label="' +
      escAttr(s.name) +
      '">' +
      '<div class="examine-backdrop" data-close></div>' +
      '<figure class="examine-photo bg-' +
      escAttr(s.bg || "white") +
      '">' +
      '<img src="' +
      escAttr(s.file) +
      '" alt="' +
      escAttr(s.name + " — " + s.locality) +
      '">' +
      "</figure>" +
      '<article class="examine-label">' +
      '<span class="label-no">Specimen № ' +
      esc(s.no || "—") +
      "</span>" +
      "<h2>" +
      esc(s.name) +
      "</h2>" +
      '<p class="label-loc">' +
      esc(s.locality) +
      "</p>" +
      '<dl class="label-rows">' +
      rows +
      "</dl>" +
      notes +
      facts +
      credit +
      "</article>" +
      '<button class="examine-close" data-close>Step back</button>' +
      '<nav class="examine-nav" aria-label="Along the shelf">' +
      '<button data-step="-1">← Previous</button>' +
      '<button data-step="1">Next →</button>' +
      "</nav>" +
      "</div>"
    );
  }

  function colophonHTML() {
    const wings = D.wingOrder
      .map((key) => {
        const w = D.wings[key];
        const rows = w.order
          .map((id) => {
            const s = w.specimens[id];
            return (
              '<div class="credit-row">' +
              '<span class="c-name">' +
              esc(s.name) +
              "</span>" +
              '<span class="c-artist">' +
              esc(s.author) +
              "</span>" +
              '<span class="c-license">' +
              esc(s.license) +
              (s.sourceUrl
                ? ' · <a href="' +
                  escAttr(s.sourceUrl) +
                  '" target="_blank" rel="noopener">source</a>'
                : "") +
              "</span>" +
              "</div>"
            );
          })
          .join("");
        return rows
          ? '<section class="credit-wing"><h2>' +
              esc(w.title) +
              "</h2>" +
              rows +
              "</section>"
          : "";
      })
      .join("");
    return (
      '<div class="scene colophon-room">' +
      wayfinding("Colophon") +
      '<div class="colophon-body">' +
      '<span class="wing-no">The reading room</span>' +
      "<h1>" +
      esc(D.colophon.title) +
      "</h1>" +
      D.colophon.body.map((p) => "<p>" + esc(p) + "</p>").join("") +
      wings +
      "</div>" +
      captionBar() +
      "</div>"
    );
  }

  /* ---------- routing ---------- */

  function parseHash() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (!parts.length) return { type: "lobby" };
    if (parts[0] === "colophon") return { type: "colophon" };
    if (parts[0] === "wing" && D.wings[parts[1]]) {
      const wing = parts[1];
      const spec =
        parts[2] && D.wings[wing].specimens[parts[2]] ? parts[2] : null;
      return { type: "wing", wing: wing, spec: spec };
    }
    return { type: "lobby" };
  }

  let current = null;

  function render() {
    const view = parseHash();
    const sameRoom =
      current &&
      current.type === "wing" &&
      view.type === "wing" &&
      current.wing === view.wing;

    if (sameRoom) {
      syncExamine(view);
      current = view;
      return;
    }

    const swap = () => {
      if (view.type === "lobby") app.innerHTML = lobbyHTML();
      else if (view.type === "colophon") app.innerHTML = colophonHTML();
      else app.innerHTML = wingHTML(D.wings[view.wing]);

      const scene = app.firstElementChild;
      scene.classList.add("scene-hidden");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => scene.classList.remove("scene-hidden")),
      );

      bindScene(view);
      window.scrollTo(0, 0);
      current = { type: view.type, wing: view.wing, spec: null };
      if (view.spec) syncExamine(view);
      else idleCaption(view);
      preloadNeighbours(view);
    };

    if (current && app.firstElementChild) {
      app.firstElementChild.classList.add("scene-hidden");
      setTimeout(swap, 300);
    } else {
      swap();
    }
  }

  function idleCaption(view) {
    if (view.type === "lobby") setCaption(D.museum.lobbyCaption);
    else if (view.type === "colophon")
      setCaption("Credits are a kind of provenance. The Grove keeps both.");
    else setCaption(D.wings[view.wing].caption);
  }

  /* ---------- examine overlay ---------- */

  function syncExamine(view) {
    const existing = document.querySelector(".examine");
    if (!view.spec) {
      if (existing) {
        existing.classList.remove("open");
        setTimeout(() => existing.remove(), 430);
        idleCaption(view);
      }
      current = view;
      return;
    }
    const wing = D.wings[view.wing];
    const html = examineHTML(wing, view.spec);
    if (existing) {
      existing.outerHTML = html;
      const el = document.querySelector(".examine");
      el.classList.add("open");
      bindExamine(el, view);
    } else {
      document.body.insertAdjacentHTML("beforeend", html);
      const el = document.querySelector(".examine");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => el.classList.add("open")),
      );
      bindExamine(el, view);
    }
    const s = wing.specimens[view.spec];
    setCaption(
      "Specimen № " + s.no + " — " + s.name + ". " + "Take your time.",
    );
    current = view;
  }

  function bindExamine(el, view) {
    const wing = D.wings[view.wing];
    el.querySelectorAll("[data-close]").forEach((b) =>
      b.addEventListener("click", () => {
        location.hash = "#/wing/" + view.wing;
      }),
    );
    el.querySelectorAll("[data-step]").forEach((b) =>
      b.addEventListener("click", () => {
        stepSpecimen(wing, view.spec, parseInt(b.dataset.step, 10));
      }),
    );
    const closeBtn = el.querySelector(".examine-close");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  function stepSpecimen(wing, id, dir) {
    const order = wing.order;
    if (!order.length) return;
    const i = order.indexOf(id);
    const next = order[(i + dir + order.length) % order.length];
    location.hash = "#/wing/" + wing.key + "/" + next;
  }

  /* ---------- binding rooms ---------- */

  function bindScene(view) {
    // image fade-in
    app.querySelectorAll(".mount img").forEach((img) => {
      if (img.complete && img.naturalWidth) img.classList.add("loaded");
      else img.addEventListener("load", () => img.classList.add("loaded"));
    });

    if (view.type === "wing") {
      const wing = D.wings[view.wing];
      app.querySelectorAll(".specimen").forEach((btn) => {
        const id = btn.dataset.id;
        const s = wing.specimens[id];
        btn.addEventListener("click", () => {
          location.hash = "#/wing/" + view.wing + "/" + id;
        });
        const hover = () =>
          setCaption(s.name + " — " + s.locality + " · click to examine");
        const rest = () => {
          if (!parseHash().spec) setCaption(wing.caption);
        };
        btn.addEventListener("mouseenter", hover);
        btn.addEventListener("focus", hover);
        btn.addEventListener("mouseleave", rest);
        btn.addEventListener("blur", rest);
      });
    }

    if (view.type === "lobby") {
      app.querySelectorAll(".plaque").forEach((p) => {
        p.addEventListener("mouseenter", () => setCaption(p.dataset.note));
        p.addEventListener("focus", () => setCaption(p.dataset.note));
        p.addEventListener("mouseleave", () =>
          setCaption(D.museum.lobbyCaption),
        );
        p.addEventListener("blur", () => setCaption(D.museum.lobbyCaption));
      });
    }
  }

  function preloadNeighbours(view) {
    if (view.type !== "wing") return;
    const nb = neighbours(view.wing);
    [nb.prev, nb.next].forEach((w) =>
      (w.order || []).forEach((id) => {
        const img = new Image();
        img.src = w.specimens[id].file;
      }),
    );
  }

  /* ---------- keyboard: walking and stepping ---------- */

  document.addEventListener("keydown", (e) => {
    const view = parseHash();
    if (e.key === "Escape" && view.type === "wing" && view.spec) {
      location.hash = "#/wing/" + view.wing;
      return;
    }
    if (view.type !== "wing") return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const dir = e.key === "ArrowRight" ? 1 : -1;
    if (view.spec) {
      stepSpecimen(D.wings[view.wing], view.spec, dir);
    } else {
      const nb = neighbours(view.wing);
      location.hash = "#/wing/" + (dir === 1 ? nb.next.key : nb.prev.key);
    }
  });

  window.addEventListener("hashchange", render);
  render();
})();
