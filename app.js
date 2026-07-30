(() => {
  const config = window.APP_CONFIG;
  const data = window.TERRITORY_DATA;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const zoneGrid = $("#zoneGrid");
  const commitmentGrid = $("#commitmentGrid");
  const dialog = $("#territoryDialog");
  const modalZone = $("#modalZone");
  const modalTitle = $("#modalTitle");
  const modalContent = $("#modalContent");
  const toast = $("#toast");
  let deferredPrompt = null;

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"}[ch]));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function renderZones() {
    zoneGrid.innerHTML = data.zones.map(zone => `
      <button class="zone-card" type="button" data-zone="${escapeHtml(zone.id)}">
        <span class="zone-card-icon" aria-hidden="true">${zone.icon}</span>
        <span class="zone-card-content">
          <h3>${escapeHtml(zone.name)}</h3>
          <p>${escapeHtml(zone.description)}</p>
          <span class="zone-count">${zone.centers.length} territorios</span>
        </span>
      </button>
    `).join("");
  }

  function centerMarkup(center) {
    const population = center.population ? `${escapeHtml(center.population)} habitantes` : "Población en actualización";
    return `
      <details class="center-card">
        <summary><span>${escapeHtml(center.name)}</span></summary>
        <div class="center-card-body">
          <div class="center-meta">
            <span class="badge pending">${population}</span>
            <span class="badge">${escapeHtml(center.status)}</span>
          </div>
          <h4>Localidades vinculadas</h4>
          <ul>${center.localities.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
          <h4>Necesidades prioritarias preliminares</h4>
          <ul>${center.needs.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
        </div>
      </details>`;
  }

  function openZone(zoneId, focusCenter = "") {
    const zone = data.zones.find(z => z.id === zoneId);
    if (!zone) return;
    modalZone.textContent = `${zone.icon} ${zone.name}`;
    modalTitle.textContent = "Territorios y necesidades";
    modalContent.innerHTML = `
      <p>${escapeHtml(zone.description)}</p>
      <div class="center-list">${zone.centers.map(centerMarkup).join("")}</div>
      <div class="data-note"><strong>Importante:</strong> esta ficha es informativa y preliminar. Las prioridades serán validadas en asambleas, recorridos y fuentes oficiales.</div>
    `;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    if (focusCenter) {
      const details = $$("details", modalContent).find(d => $("summary span", d)?.textContent === focusCenter);
      if (details) {
        details.open = true;
        setTimeout(() => details.scrollIntoView({behavior:"smooth", block:"start"}), 120);
      }
    }
  }

  function closeDialog(dlg) {
    if (dlg?.open) dlg.close();
    document.body.style.overflow = "";
  }

  function renderCommitments() {
    commitmentGrid.innerHTML = data.commitments.map(item => `
      <article class="commitment-card">
        <span aria-hidden="true">${item.icon}</span>
        <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>
      </article>
    `).join("");
  }

  function bindForms() {
    $("#formPersoneros").href = config.forms.personeros;
    $("#formSimpatizantes").href = config.forms.simpatizantes;
    $("#formProfesionales").href = config.forms.profesionales;
  }

  const allTerritories = data.zones.flatMap(zone => zone.centers.map(center => ({zone, center})));
  function normalize(text) {
    return String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function setupSearch() {
    const input = $("#territorySearch");
    const results = $("#searchResults");
    input.addEventListener("input", () => {
      const q = normalize(input.value.trim());
      if (q.length < 2) { results.hidden = true; results.innerHTML = ""; return; }
      const found = allTerritories.filter(({center}) => {
        const haystack = normalize([center.name, ...center.localities, ...center.needs].join(" "));
        return haystack.includes(q);
      }).slice(0, 12);
      results.innerHTML = found.length ? found.map(({zone, center}) => `
        <button class="search-result" type="button" data-zone="${zone.id}" data-center="${escapeHtml(center.name)}">
          <span><strong>${escapeHtml(center.name)}</strong><small>${escapeHtml(zone.name)}</small></span><span>→</span>
        </button>
      `).join("") : `<div class="search-result"><span><strong>No encontramos coincidencias.</strong><small>Prueba con otro nombre o sector.</small></span></div>`;
      results.hidden = false;
    });
    results.addEventListener("click", event => {
      const button = event.target.closest("button[data-zone]");
      if (!button) return;
      openZone(button.dataset.zone, button.dataset.center);
      results.hidden = true;
    });
  }

  async function shareApp(mode = "general") {
    const url = location.protocol.startsWith("http") ? location.href.split("#")[0] : config.facebookUrl;
    const messages = {
      general: `Conoce la aplicación ciudadana de Jimmy Isidro para Independencia: centros poblados, propuestas y formas de participación. ${url}`,
      chain: `Te invito a conocer la aplicación de Jimmy Isidro. Encuentra tu barrio o centro poblado y participa voluntariamente por Independencia. ${url}`
    };
    const text = messages[mode];
    if (navigator.share) {
      try { await navigator.share({title:"Jimmy Isidro | Independencia", text, url}); return; } catch (e) { if (e.name === "AbortError") return; }
    }
    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank", "noopener,noreferrer");
  }

  function setupInstall() {
    const installDialog = $("#installDialog");
    const openButtons = [$("#installCard"), $("#installTop")];
    openButtons.forEach(btn => btn?.addEventListener("click", () => installDialog.showModal()));
    $("#nativeInstall").addEventListener("click", async () => {
      if (!deferredPrompt) { showToast("En iPhone usa Safari → Compartir → Agregar a inicio."); return; }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      $("#installTop").hidden = true;
      closeDialog(installDialog);
    });
    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      deferredPrompt = event;
      $("#installTop").hidden = false;
    });
    window.addEventListener("appinstalled", () => showToast("Aplicación instalada correctamente."));
  }

  function setupNavigation() {
    const links = $$(".bottom-nav a");
    const sections = links.map(a => document.getElementById(a.dataset.section)).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(a => a.classList.toggle("active", a.dataset.section === entry.target.id));
        }
      });
    }, {rootMargin:"-38% 0px -55% 0px", threshold:0});
    sections.forEach(section => observer.observe(section));
  }

  function setupEvents() {
    zoneGrid.addEventListener("click", e => {
      const card = e.target.closest("[data-zone]");
      if (card) openZone(card.dataset.zone);
    });
    $("#closeTerritory").addEventListener("click", () => closeDialog(dialog));
    dialog.addEventListener("click", e => { if (e.target === dialog) closeDialog(dialog); });
    $$(".close-generic").forEach(btn => btn.addEventListener("click", () => closeDialog(btn.closest("dialog"))));
    $$("dialog").forEach(dlg => dlg.addEventListener("click", e => { if (e.target === dlg) closeDialog(dlg); }));
    $("#privacyButton").addEventListener("click", () => $("#privacyDialog").showModal());
    $("#shareHero").addEventListener("click", () => shareApp("general"));
    $("#shareFinal").addEventListener("click", () => shareApp("general"));
    $("#shareChain").addEventListener("click", () => shareApp("chain"));
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  renderZones();
  renderCommitments();
  bindForms();
  setupSearch();
  setupInstall();
  setupNavigation();
  setupEvents();
  registerServiceWorker();
})();
