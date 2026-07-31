/* ============================================================================
   JIMMY ISIDRO · INDEPENDENCIA — app.js v5
   Navegación por pantallas. Una tarea por vista. Sin dependencias externas.
   ========================================================================== */
(function () {
  "use strict";

  var CFG   = window.APP_CONFIG || {};
  var DATA  = window.TERRITORY_DATA || {};
  var ZONES = DATA.zones || [];

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var TITULOS = {
    inicio: "Inicio", territorio: "Territorio", sumate: "Súmate",
    propuestas: "Propuestas", jimmy: "Jimmy Isidro"
  };
  var RAIZ = ["inicio", "territorio", "sumate", "propuestas", "jimmy"];

  /* Los datos traen emojis; aquí se traducen al juego de iconos dibujado. */
  var ICONOS = {
    "💧": "i-drop", "🛡️": "i-shield", "🛡": "i-shield", "📍": "i-pin",
    "📈": "i-chart", "❤️": "i-heart", "❤": "i-heart", "🧠": "i-users",
    "🗳️": "i-shield", "🤝": "i-users", "🏔️": "i-map", "⛰️": "i-map", "🏙️": "i-map"
  };
  function icono(emoji, alterno) {
    return ICONOS[String(emoji || "").trim()] || alterno || "i-check";
  }
  function svgIcono(id, clase) {
    return '<svg class="ic ' + (clase || "") + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }

  /* ------------------------------------------------------------ utilidades */
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  var toastId;
  function toast(msg) {
    var t = $("#toast");
    t.innerHTML = svgIcono("i-check", "ic-sm") + "<span>" + esc(msg) + "</span>";
    t.classList.add("on");
    clearTimeout(toastId);
    toastId = setTimeout(function () { t.classList.remove("on"); }, 2800);
  }
  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) { return null; }
  }
  function wa(text) {
    var n = (CFG.whatsappNumber || "").replace(/\D/g, "");
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(text || CFG.whatsappText || "");
  }
  function zonaPorId(id) {
    for (var i = 0; i < ZONES.length; i++) if (ZONES[i].id === id) return ZONES[i];
    return null;
  }

  /* -------------------------------------------------- arte: curvas de nivel
     Cada zona tiene su propio relieve. Es decoración de fondo: nunca lleva
     texto encima y siempre queda en el tercio derecho de la tarjeta.        */
  function arte(id) {
    if (id === "blanca") {
      return '<svg viewBox="0 0 200 140" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">' +
        '<g fill="none" stroke="#7FA0BE" stroke-width="1.1" opacity=".45">' +
          '<path d="M0,58 C34,44 52,66 84,50 C118,33 132,16 168,26 C186,31 194,38 200,42"/>' +
          '<path d="M0,74 C34,60 52,82 84,66 C118,49 132,32 168,42 C186,47 194,54 200,58"/></g>' +
        '<path d="M0,140 L0,104 L36,64 L60,94 L98,36 L136,88 L166,56 L200,90 L200,140 Z" fill="#A8C4DC" opacity=".5"/>' +
        '<path d="M98,36 L116,60 L80,60 Z M36,64 L50,82 L22,82 Z M166,56 L180,74 L152,74 Z" fill="#FFFFFF"/></svg>';
    }
    if (id === "negra") {
      return '<svg viewBox="0 0 200 140" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">' +
        '<g fill="none" stroke="#F5C400" stroke-width="1.1" opacity=".22">' +
          '<path d="M0,54 C34,40 52,62 84,46 C118,29 132,12 168,22 C186,27 194,34 200,38"/>' +
          '<path d="M0,72 C34,58 52,80 84,64 C118,47 132,30 168,40 C186,45 194,52 200,56"/></g>' +
        '<path d="M0,140 L0,110 L34,72 L62,102 L96,48 L130,94 L200,58 L200,140 Z" fill="#000000" opacity=".34"/>' +
        '<path d="M0,140 L0,124 L40,100 L74,120 L110,86 L146,112 L200,88 L200,140 Z" fill="#000000" opacity=".3"/></svg>';
    }
    return '<svg viewBox="0 0 200 140" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">' +
      '<g fill="none" stroke="#8A6D00" stroke-width="1.1" opacity=".28">' +
        '<path d="M0,46 C34,32 52,54 84,38 C118,21 132,6 168,16 C186,21 194,26 200,30"/>' +
        '<path d="M0,64 C34,50 52,72 84,56 C118,39 132,24 168,34 C186,39 194,44 200,48"/></g>' +
      '<g fill="#7A6200" opacity=".26">' +
        '<rect x="6" y="86" width="26" height="54" rx="2"/><rect x="40" y="66" width="30" height="74" rx="2"/>' +
        '<rect x="78" y="98" width="24" height="42" rx="2"/><rect x="110" y="54" width="32" height="86" rx="2"/>' +
        '<rect x="150" y="80" width="26" height="60" rx="2"/><rect x="182" y="66" width="18" height="74" rx="2"/></g></svg>';
  }

  /* ------------------------------------------------------------- pintar UI */
  function pintarZonas() {
    $("#zoneCards").innerHTML = ZONES.map(function (z) {
      var n = (z.centers || []).length;
      return '<a class="zone z-' + esc(z.id) + '" href="#/zona/' + esc(z.id) + '">' +
        '<span class="zone-art">' + arte(z.id) + '</span>' +
        '<span class="zone-in"><span class="eyebrow">Zona</span>' +
        "<h3>" + esc(z.name) + "</h3>" +
        '<span class="zone-meta">' + n + (n === 1 ? " territorio" : " territorios") +
        svgIcono("i-right", "ic-sm") + "</span></span></a>";
    }).join("");
  }

  function pintarLista(zid) {
    var z = zonaPorId(zid);
    if (!z) { location.hash = "#/territorio"; return; }
    $("#listaTitulo").textContent = z.name;
    $("#listaDesc").textContent = z.description || "";
    $("#listaItems").innerHTML = (z.centers || []).map(function (c, i) {
      var n = (c.localities || []).length;
      return '<a class="row" href="#/ficha/' + esc(z.id) + "/" + i + '">' +
        '<span class="row-idx num">' + (i + 1 < 10 ? "0" : "") + (i + 1) + "</span>" +
        '<span class="row-tx"><strong>' + esc(c.name) + "</strong><small>" +
        (n ? n + (n === 1 ? " localidad vinculada" : " localidades vinculadas") : "Padrón en actualización") +
        "</small></span>" + '<span class="row-go">' + svgIcono("i-right", "ic-sm") + "</span></a>";
    }).join("");
    return z.name;
  }

  var fichaActual = null;
  function pintarFicha(zid, idx) {
    var z = zonaPorId(zid);
    var c = z && z.centers ? z.centers[idx] : null;
    if (!c) { location.hash = "#/territorio"; return; }
    fichaActual = { zid: zid, idx: idx, zona: z.name, nombre: c.name };

    var hero = $("#fichaHero");
    hero.className = "ficha-hero fh-" + z.id;
    var art = hero.querySelector(".ficha-art");
    if (art) art.remove();
    hero.insertAdjacentHTML("afterbegin", '<span class="ficha-art">' + arte(z.id) + "</span>");

    $("#fichaZona").textContent = z.name;
    $("#fichaNombre").textContent = c.name;
    $("#fichaEstado").innerHTML = svgIcono("i-info", "ic-sm") + esc(c.status || "Información en validación");

    var locs = (c.localities && c.localities.length) ? c.localities : ["Localidades en actualización oficial"];
    $("#fichaLocs").innerHTML = locs.map(function (l) {
      return '<span class="chip">' + esc(l) + "</span>";
    }).join("");

    $("#fichaNeeds").innerHTML = (c.needs || []).map(function (n) {
      return "<li>" + esc(n) + "</li>";
    }).join("");

    var d = DATA.district || {};
    $("#fichaNota").innerHTML =
      "<strong>Población:</strong> el Censo " + esc(d.censusYear || "2017") + " registró " +
      esc(d.censusPopulation || "76 088") + " habitantes en todo el distrito (" +
      esc(d.urbanShare || "84,93 %") + " urbanos). Todavía no existe una cifra oficial desagregada por " +
      "centro poblado o barrio. " + esc(d.note || "");

    return c.name;
  }

  function pintarCompromisos() {
    $("#commitList").innerHTML = (DATA.commitments || []).map(function (c) {
      return '<div class="card"><div class="commit">' +
        '<span class="commit-ic">' + svgIcono(icono(c.icon), "ic-lg") + "</span>" +
        '<span class="commit-tx"><h3>' + esc(c.title) + "</h3>" +
        '<p class="lead">' + esc(c.text) + "</p></span></div></div>";
    }).join("");
  }

  /* --------------------------------------------------------------- búsqueda */
  function buscar(term) {
    var q = norm(term).trim();
    var out = $("#results");
    if (q.length < 2) { out.innerHTML = ""; return; }

    var hits = [];
    ZONES.forEach(function (z) {
      (z.centers || []).forEach(function (c, i) {
        var campos = [c.name].concat(c.localities || []);
        if (campos.some(function (t) { return norm(t).indexOf(q) !== -1; }) && hits.length < 8) {
          var sub = (c.localities || []).filter(function (t) { return norm(t).indexOf(q) !== -1; })[0];
          hits.push({ z: z, c: c, i: i, sub: (sub && norm(sub) !== norm(c.name)) ? sub : z.name });
        }
      });
    });

    out.innerHTML = hits.length
      ? hits.map(function (h) {
          return '<a class="row" href="#/ficha/' + esc(h.z.id) + "/" + h.i + '">' +
            '<span class="row-ic">' + svgIcono("i-pin") + "</span>" +
            '<span class="row-tx"><strong>' + esc(h.c.name) + "</strong><small>" + esc(h.sub) + "</small></span>" +
            '<span class="row-go">' + svgIcono("i-right", "ic-sm") + "</span></a>";
        }).join("")
      : '<div class="note note-quiet">' + svgIcono("i-info", "ic-sm") +
        "<span>No encontramos ese nombre todavía. El padrón sigue en construcción: escríbenos por WhatsApp y lo agregamos.</span></div>";
  }

  /* ---------------------------------------------------------------- mi zona */
  function leerZonaGuardada() {
    try { return JSON.parse(store("jimmyIsidroMyZone") || "null"); } catch (e) { return null; }
  }
  function pintarZonaGuardada() {
    var s = leerZonaGuardada();
    var b = $("#savedBlock");
    if (!s || !s.nombre) { b.hidden = true; return; }
    b.hidden = false;
    $("#savedName").textContent = s.nombre;
    $("#savedParent").textContent = s.zona;
    $("#rowSaved").onclick = function () { location.hash = "#/ficha/" + s.zid + "/" + s.idx; };
  }

  /* --------------------------------------------------------------- enrutado */
  function mostrar(id) {
    $$(".screen").forEach(function (s) { s.classList.toggle("on", s.id === "s-" + id); });
  }
  function marcarTab(t) {
    $$(".tab").forEach(function (x) { x.classList.toggle("on", x.dataset.tab === t); });
  }

  function router() {
    var p = (location.hash || "#/inicio").replace(/^#\/?/, "").split("/");
    var vista = p[0] || "inicio";

    if (vista === "zona") {
      var nz = pintarLista(p[1]);
      if (nz === undefined) return;
      mostrar("lista");
      document.body.dataset.nivel = "detalle";
      $("#barTitle").textContent = nz;
      marcarTab("territorio");
      $("#btnBack").dataset.to = "#/territorio";

    } else if (vista === "ficha") {
      var nf = pintarFicha(p[1], parseInt(p[2], 10));
      if (nf === undefined) return;
      mostrar("ficha");
      document.body.dataset.nivel = "detalle";
      $("#barTitle").textContent = nf;
      marcarTab("territorio");
      $("#btnBack").dataset.to = "#/zona/" + p[1];

    } else {
      if (RAIZ.indexOf(vista) === -1) vista = "inicio";
      mostrar(vista);
      document.body.dataset.nivel = "raiz";
      $("#barTitle").textContent = TITULOS[vista];
      marcarTab(vista);
      if (vista === "inicio") pintarZonaGuardada();
    }
    window.scrollTo(0, 0);
  }

  /* -------------------------------------------------------------- compartir */
  function compartir(titulo, texto) {
    var url = location.href.split("#")[0];
    if (navigator.share) {
      navigator.share({ title: titulo, text: texto, url: url }).catch(function () {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto + " " + url).then(function () {
        toast("Enlace copiado. Pégalo en WhatsApp.");
      });
    } else {
      window.open(wa(texto + " " + url), "_blank", "noopener");
    }
  }

  /* ------------------------------------------------------------ instalación */
  var diferido = null;
  function setupInstall() {
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      diferido = e;
      $("#btnInstallTop").hidden = false;
    });
    window.addEventListener("appinstalled", function () {
      diferido = null;
      $("#btnInstallTop").hidden = true;
      toast("Aplicación instalada correctamente.");
    });
    $("#btnNativeInstall").addEventListener("click", function () {
      if (!diferido) {
        toast("Usa el menú del navegador: Agregar a la pantalla principal.");
        return;
      }
      diferido.prompt();
      diferido.userChoice.finally(function () {
        diferido = null;
        $("#dlgInstall").close();
      });
    });
  }

  /* ---------------------------------------------------------------- enlaces */
  function enlazar() {
    var f = CFG.forms || {};
    var set = function (sel, href) { var el = $(sel); if (el && href) el.href = href; };

    set("#formPersoneros", f.personeros);
    set("#formSimpatizantes", f.simpatizantes);
    set("#formProfesionales", f.profesionales);
    set("#btnFichaSumar", f.simpatizantes);
    set("#fbJimmy", CFG.facebookUrl);
    set("#waHero", wa());
    set("#waJimmy", wa());

    var n = (CFG.whatsappNumber || "").replace(/\D/g, "").replace(/^51/, "");
    $("#waNumber").textContent = n.length === 9
      ? n.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
      : "Escríbele directamente";
  }

  /* ----------------------------------------------------------------- eventos */
  function eventos() {
    window.addEventListener("hashchange", router);

    $("#btnBack").addEventListener("click", function () {
      location.hash = this.dataset.to || "#/territorio";
    });

    var tId;
    $("#q").addEventListener("input", function () {
      var v = this.value;
      clearTimeout(tId);
      tId = setTimeout(function () { buscar(v); }, 130);
    });

    $("#btnGuardarZona").addEventListener("click", function () {
      if (!fichaActual) return;
      store("jimmyIsidroMyZone", JSON.stringify(fichaActual));
      pintarZonaGuardada();
      toast(fichaActual.nombre + " es ahora tu zona.");
    });

    $("#btnFichaShare").addEventListener("click", function () {
      if (!fichaActual) return;
      compartir("Ficha de " + fichaActual.nombre,
        "Mira la ficha de " + fichaActual.nombre + " (" + fichaActual.zona +
        ") en la app de Jimmy Isidro para Independencia:");
    });

    $("#btnShareHome").addEventListener("click", function () {
      compartir("Jimmy Isidro · Independencia",
        "Descarga la app de Jimmy Isidro: encuentra tu caserío o barrio y conoce las propuestas para Independencia.");
    });

    $("#btnInstall").addEventListener("click", function () { $("#dlgInstall").showModal(); });
    $("#btnInstallTop").addEventListener("click", function () { $("#dlgInstall").showModal(); });
    $("#btnPrivacy").addEventListener("click", function () { $("#dlgPrivacy").showModal(); });

    $$("[data-close]").forEach(function (b) {
      b.addEventListener("click", function () { b.closest("dialog").close(); });
    });
    $$("dialog").forEach(function (d) {
      d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    });
  }

  /* -------------------------------------------------------------------- init */
  function init() {
    enlazar();
    pintarZonas();
    pintarCompromisos();
    eventos();
    setupInstall();
    router();

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () {});
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
