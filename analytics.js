/* reLEGENDS COLLECTION – měření návštěvnosti (Google Analytics 4) + lišta souhlasu s cookies.
   ▶ JEDINÁ VĚC K ÚPRAVĚ: sem vlož své Measurement ID z Google Analytics (začíná "G-"). */
var RL_GA_ID = "G-XXXXXXXXXX";

(function () {
  var KEY = "rl-consent";            // "granted" | "denied"
  var lang = (document.documentElement.lang || "cs").slice(0, 2);
  var T = {
    cs: { t: "Cookies", p: "Rádi bychom měřili návštěvnost webu, abychom ho mohli zlepšovat. Analytické cookies (Google Analytics) použijeme jen s tvým souhlasem.", ok: "Přijmout", no: "Odmítnout", more: "Více informací" },
    en: { t: "Cookies", p: "We'd like to measure visits so we can keep improving this site. We only use analytics cookies (Google Analytics) with your consent.", ok: "Accept", no: "Decline", more: "Learn more" },
    de: { t: "Cookies", p: "Wir möchten die Besuche auf dieser Website messen, um sie zu verbessern. Analyse-Cookies (Google Analytics) setzen wir nur mit deiner Zustimmung.", ok: "Akzeptieren", no: "Ablehnen", more: "Mehr erfahren" },
    it: { t: "Cookie", p: "Vorremmo misurare le visite per migliorare il sito. Usiamo i cookie analitici (Google Analytics) solo con il tuo consenso.", ok: "Accetta", no: "Rifiuta", more: "Maggiori informazioni" }
  }[lang] || null;
  if (!T) T = { t: "Cookies", p: "", ok: "OK", no: "No", more: "Info" };
  var PRIVACY = "https://relegends.cz/ochrana-osobnich-udaju/";
  var hasId = /^G-[A-Z0-9]{4,}$/.test(RL_GA_ID) && RL_GA_ID !== "G-XXXXXXXXXX";

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });

  var loaded = false;
  function load() {
    if (loaded || !hasId) return;
    loaded = true;
    gtag("consent", "update", { analytics_storage: "granted" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + RL_GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", RL_GA_ID, { anonymize_ip: true });
  }
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  /* events: sent only after consent */
  window.rlTrack = function (name, params) { if (loaded) gtag("event", name, params || {}); };
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a || !a.href) return;
    var h = a.href, where = (a.closest("[id]") || {}).id || "";
    if (h.indexOf("shop.relegends.cz/p/") > -1) rlTrack("buy_click", { placement: where });
    else if (h.indexOf("instagram.com") > -1) rlTrack("instagram_click", { placement: where });
    else if (a.closest(".partner")) { var im = a.querySelector("img"); rlTrack("partner_click", { partner: im ? im.alt : a.textContent.trim() }); }
    else if (h.indexOf("colectio.com") > -1) rlTrack("colectio_click", { placement: where });
    else if (h.indexOf("relegends.cz/auta/") > -1 || h.indexOf("relegends.cz/katalog-aut") > -1) rlTrack("car_story_click", { link: h });
  }, true);

  /* banner */
  function css() {
    var st = document.createElement("style");
    st.textContent =
      ".rl-cc{position:fixed;z-index:200;left:max(16px,env(safe-area-inset-left,0px));right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));" +
      "max-width:460px;background:#FFFFFF;color:#111111;border:1px solid rgba(17,17,17,.12);border-radius:16px;box-shadow:0 18px 50px rgba(17,17,17,.18);padding:20px 22px;" +
      "font-family:Poppins,'Helvetica Neue',Arial,sans-serif;display:grid;gap:12px}" +
      ".rl-cc b{font-size:12px;font-weight:600;letter-spacing:.24em;text-transform:uppercase}" +
      ".rl-cc p{margin:0;font-size:14px;line-height:1.6;color:#3A3A3F}" +
      ".rl-cc a{color:#111111;font-size:13px}" +
      ".rl-cc .rl-cc-b{display:flex;gap:10px;flex-wrap:wrap}" +
      ".rl-cc button{flex:1 1 140px;min-height:46px;border-radius:999px;border:1px solid #111111;background:#FFFFFF;color:#111111;font:600 12px/1 Poppins,'Helvetica Neue',Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}" +
      ".rl-cc button.ok{background:#111111;color:#FFFFFF}" +
      ".rl-cc button:focus-visible{outline:2px solid #E10600;outline-offset:3px}";
    document.head.appendChild(st);
  }
  var box = null;
  function show() {
    if (!hasId) return;            // nothing to ask about until GA is set up
    if (box) { box.hidden = false; return; }
    css();
    box = document.createElement("div");
    box.className = "rl-cc";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", T.t);
    box.innerHTML = "<b>" + T.t + "</b><p>" + T.p + " <a href='" + PRIVACY + "' target='_blank' rel='noopener'>" + T.more + "</a></p>" +
      "<div class='rl-cc-b'><button type='button' class='no'>" + T.no + "</button><button type='button' class='ok'>" + T.ok + "</button></div>";
    box.querySelector(".ok").onclick = function () { set("granted"); box.hidden = true; load(); };
    box.querySelector(".no").onclick = function () {
      var was = loaded; set("denied"); box.hidden = true;
      if (was) { gtag("consent", "update", { analytics_storage: "denied" }); location.reload(); }
    };
    document.body.appendChild(box);
  }
  function init() {
    var c = get();
    if (c === "granted") load(); else if (c !== "denied") show();
    document.querySelectorAll("[data-cookie-settings]").forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); show(); });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
