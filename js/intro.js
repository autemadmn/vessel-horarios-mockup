// VESSEL · intro de marca (misma idea que la carta de Caribbean's Avenue).
//
//   dibujando ──(logo completo + app lista)──▶ abriendo ──▶ fin
//        └─(4 s sin que la app avise)──────────▶ abriendo (se abre igualmente)
//
// - El logo se dibuja con CSS desde el primer pintado (estilos en línea en index.html):
//   las tres V del emblema se trazan, VESSEL sube letra a letra desde su línea base y
//   CLUB se descubre de izquierda a derecha.
// - Apertura: desde el fondo de la copa (el cruce de las V) se abre un círculo hacia la
//   app mientras el emblema y la palabra vuelan a su sitio exacto en la cabecera de Inicio.
//   Al aterrizar se quita la intro y aparece la cabecera, oculta hasta entonces, en el mismo
//   lugar: se lee como un único objeto.
// - Reloj real (requestAnimationFrame + performance.now): en un móvil cargado termina a
//   tiempo en lugar de alargarse.
// - Una vez por sesión. Con «reducir movimiento»: logo quieto que se desvanece.
// - ?intro=1 la fuerza, ?intro=0 la salta, ?intro=debug la congela (&at=<ms>, &open=<0..1>).
(() => {
  const html = document.documentElement;
  const root = document.getElementById("intro");
  const api = { active: false, state: "off", ready() {}, done: Promise.resolve() };
  window.VesselIntro = api;

  if (!root) return;
  if (!html.classList.contains("intro-active")) {
    root.remove();
    return;
  }

  const SAFETY_MS = 4000;
  const OPEN_MS = 620;
  const CUP = { x: 0.5, y: 0.86 }; // fondo de la copa, en unidades del emblema

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const logo = root.querySelector("#introLogo");
  const emblem = root.querySelector(".intro-emblem");
  const word = root.querySelector(".intro-word");
  const club = root.querySelector(".intro-club");
  const veil = root.querySelector(".intro-veil");
  const rim = root.querySelector(".intro-rim circle");

  api.active = true;
  api.state = "drawing";

  let markReady;
  const ready = new Promise((resolve) => (markReady = resolve));
  api.ready = () => markReady();
  if (html.dataset.ready === "true") markReady();

  // El dibujo termina cuando acaban sus animaciones (sirve aunque este script llegue tarde).
  const drawn = new Promise((resolve) => {
    if (reduced) {
      setTimeout(resolve, 350);
      return;
    }
    const running = root.getAnimations ? root.getAnimations({ subtree: true }) : [];
    Promise.all(running.map((a) => a.finished.catch(() => {}))).then(resolve);
    setTimeout(resolve, 1200); // por si las animaciones no corren (pestaña en segundo plano)
  });

  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeIn = (t) => t * t;
  const lerp = (a, b, t) => a + (b - a) * t;

  function finish() {
    html.classList.remove("intro-active");
    html.classList.add("intro-done");
    root.remove();
    try {
      sessionStorage.setItem("vessel-intro-seen", "1");
    } catch {
      // modo privado: puede repetirse la próxima vez, sin más
    }
    api.state = "done";
  }

  const visible = (r) => r && r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;

  /** Mide una vez y devuelve una función que pinta cualquier instante p ∈ [0, 1]. */
  function prepareOpening() {
    const fromE = emblem.getBoundingClientRect();
    const fromW = word.getBoundingClientRect();
    const fromC = club.getBoundingClientRect();
    const toE = document.querySelector(".home-head .brand-emblem")?.getBoundingClientRect();
    const toW = document.querySelector(".home-head .brand-word")?.getBoundingClientRect();

    // Cada parte va a su sitio; si no hay sitio visible, crece un poco y se desvanece.
    const flight = (from, to) =>
      visible(to)
        ? { lands: true, s: to.width / from.width, dx: to.left - from.left, dy: to.top - from.top }
        : { lands: false, s: 1.06, dx: -from.width * 0.03, dy: 0 };
    const e = flight(fromE, toE);
    const w = flight(fromW, toW);
    // CLUB acompaña a la palabra (misma transformación respecto a ella) y se apaga.
    const c = {
      lands: false,
      s: w.s,
      dx: fromW.left + w.dx + (fromC.left - fromW.left) * w.s - fromC.left,
      dy: fromW.top + w.dy + (fromC.top - fromW.top) * w.s - fromC.top,
    };

    const start = { x: fromE.left + fromE.width * CUP.x, y: fromE.top + fromE.height * CUP.y };
    const end = {
      x: fromE.left + e.dx + fromE.width * CUP.x * e.s,
      y: fromE.top + e.dy + fromE.height * CUP.y * e.s,
    };
    const reach =
      Math.hypot(Math.max(end.x, window.innerWidth - end.x), Math.max(end.y, window.innerHeight - end.y)) + 24;

    for (const el of [emblem, word, club]) {
      el.style.transformOrigin = "0 0";
      el.style.willChange = "transform, opacity";
    }
    root.classList.add("is-opening");

    const place = (el, f, move, fade) => {
      el.style.transform = `translate(${f.dx * move}px, ${f.dy * move}px) scale(${lerp(1, f.s, move)})`;
      if (fade !== null) el.style.opacity = String(fade);
    };

    return (p) => {
      const move = easeInOut(p);
      const aperture = easeIn(p);
      const late = 1 - Math.max(0, (p - 0.4) / 0.6);
      place(emblem, e, move, e.lands ? null : late);
      place(word, w, move, w.lands ? null : late);
      place(club, c, move, 1 - Math.min(1, p / 0.35));
      const hx = lerp(start.x, end.x, move);
      const hy = lerp(start.y, end.y, move);
      veil.style.setProperty("--hx", `${hx}px`);
      veil.style.setProperty("--hy", `${hy}px`);
      veil.style.setProperty("--hr", `${aperture * reach}px`);
      if (rim) {
        rim.setAttribute("cx", hx.toFixed(1));
        rim.setAttribute("cy", hy.toFixed(1));
        rim.setAttribute("r", Math.max(0, aperture * reach - 0.5).toFixed(1));
        // el borde del círculo se ilumina al abrir y se apaga antes de terminar
        rim.style.opacity = String(Math.min(1, p / 0.15) * Math.max(0, 1 - p / 0.85) * 0.8);
      }
    };
  }

  function open() {
    api.state = "opening";
    return new Promise((resolve) => {
      const done = () => {
        finish();
        resolve();
      };
      if (reduced) {
        root.style.transition = "opacity 300ms ease";
        root.style.opacity = "0";
        setTimeout(done, 320);
        return;
      }
      const paint = prepareOpening();
      const t0 = performance.now();
      const frame = (now) => {
        const p = Math.min(1, (now - t0) / OPEN_MS);
        paint(p);
        if (p < 1) requestAnimationFrame(frame);
        else done();
      };
      requestAnimationFrame(frame);
    });
  }

  api.done = new Promise((resolve) => {
    let settled = false;
    const go = () => {
      if (settled) return;
      settled = true;
      open().then(resolve);
    };
    const query = new URLSearchParams(location.search);
    if (query.get("intro") === "debug") {
      // solo para revisar el diseño: se congela y se pinta el instante pedido
      let paint = null;
      api.preview = (p) => (paint ||= prepareOpening())(p);
      if (query.has("at")) {
        const at = Number(query.get("at"));
        root.getAnimations({ subtree: true }).forEach((a) => {
          a.pause();
          a.currentTime = at;
        });
      }
      if (query.has("open")) ready.then(() => api.preview(Number(query.get("open"))));
      return;
    }
    Promise.all([ready, drawn]).then(go);
    setTimeout(go, SAFETY_MS);
  });
})();
