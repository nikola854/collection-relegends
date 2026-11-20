/* reLEGENDS COLLECTION: GA4 + Meta Pixel; separate, opt-in consent. */
/* Production IDs; no access tokens or customer data. */
var RL_GA_ID = "G-C5VTK2V5W3";
(function () {
  'use strict';
  if (window.__rlMeasurementV2) return;
  window.__rlMeasurementV2 = true;
  var PIXEL = '3528855153953515', KEY = 'rl-consent-v2';
  var lang = (document.documentElement.lang || 'cs').slice(0, 2);
  var words = {
    cs: ['Cookies a měření','Analytika (Google Analytics) nám pomáhá zlepšovat web. Marketingové měření (Meta Pixel) pomáhá vyhodnocovat reklamy. Obojí je volitelné a můžeš souhlas kdykoliv změnit.','Přijmout vše','Odmítnout vše','Nastavení','Uložit volby','Analytické měření','Marketingové měření','Více informací'],
    en: ['Cookies and measurement','Analytics (Google Analytics) helps us improve this website. Marketing measurement (Meta Pixel) helps evaluate ads. Both are optional; you can change consent at any time.','Accept all','Reject all','Settings','Save choices','Analytics measurement','Marketing measurement','Learn more'],
    de: ['Cookies und Messung','Analysen (Google Analytics) helfen uns, diese Website zu verbessern. Marketingmessung (Meta Pixel) hilft bei der Auswertung von Werbung. Beides ist optional; du kannst deine Einwilligung jederzeit ändern.','Alle akzeptieren','Alle ablehnen','Einstellungen','Auswahl speichern','Analytische Messung','Marketingmessung','Mehr erfahren'],
    it: ['Cookie e misurazione','Le analisi (Google Analytics) ci aiutano a migliorare il sito. La misurazione di marketing (Meta Pixel) serve a valutare gli annunci. Entrambe sono facoltative; puoi cambiare il consenso in qualsiasi momento.','Accetta tutti','Rifiuta tutti','Impostazioni','Salva scelte','Misurazione analitica','Misurazione marketing','Maggiori informazioni']
  };
  var t = words[lang] || words.en, gaLoaded = false, metaLoaded = false, pageSent = false, box;
  var consent = { analytics: false, marketing: false }, saved = false;
  try {
    var previous = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (previous && previous.version === 2) {
      consent.analytics = previous.analytics === true;
      consent.marketing = previous.marketing === true;
      saved = true;
    } else {
      // Old analytics-only permission never grants permission to Meta.
      consent.analytics = localStorage.getItem('rl-consent') === 'granted';
    }
  } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', { analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' });

  function loadGA() {
    if (!consent.analytics || gaLoaded) return;
    gaLoaded = true;
    window['ga-disable-' + RL_GA_ID] = false;
    gtag('consent', 'update', { analytics_storage:'granted' });
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + RL_GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', RL_GA_ID, { allow_google_signals:false, allow_ad_personalization_signals:false });
  }
  function loadMeta() {
    if (!consent.marketing || metaLoaded) return;
    metaLoaded = true;
    if (!window.fbq) {
      var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!window._fbq) window._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      var s = document.createElement('script'); s.async = true;
      s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(s);
    }
    fbq('consent', 'grant');
    fbq('set', 'autoConfig', false, PIXEL);
    fbq('init', PIXEL);
    if (!pageSent) { pageSent = true; fbq('trackSingle', PIXEL, 'PageView'); }
  }
  function clearCookies(analytics, marketing) {
    document.cookie.split(';').forEach(function (item) {
      var name = item.split('=')[0].trim();
      if (!((analytics && /^_ga(?:_|$)|^_gid$|^_gat/.test(name)) || (marketing && /^_fb[pc]$/.test(name)))) return;
      ['', location.hostname, '.relegends.cz'].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax; Secure' + (domain ? '; domain=' + domain : '');
      });
    });
  }
  function choose(a, m) {
    var revokeGA = consent.analytics && !a, revokeMeta = consent.marketing && !m;
    consent = { analytics:!!a, marketing:!!m }; saved = true;
    try { localStorage.setItem(KEY, JSON.stringify({ version:2, analytics:!!a, marketing:!!m })); localStorage.removeItem('rl-consent'); } catch (_) {}
    if (box) box.hidden = true;
    if (revokeGA && gaLoaded) {
      window['ga-disable-' + RL_GA_ID] = true;
      gtag('consent', 'update', { analytics_storage:'denied' });
    }
    if (revokeMeta && metaLoaded && window.fbq) fbq('consent', 'revoke');
    clearCookies(revokeGA, revokeMeta);
    // Unload previously authorised libraries before any further interaction.
    if ((revokeGA && gaLoaded) || (revokeMeta && metaLoaded)) { location.reload(); return; }
    loadGA(); loadMeta();
  }
  window.rlTrack = function (name, params) { if (consent.analytics && gaLoaded) gtag('event', name, params || {}); };
  var attribution = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid'];
  function decorate(a) {
    try {
      var target = new URL(a.href, location.href);
      if (target.hostname !== 'shop.relegends.cz') return;
      var source = new URL(location.href);
      attribution.forEach(function (key) {
        var value = source.searchParams.get(key);
        if (value && !target.searchParams.has(key)) target.searchParams.set(key, value);
      });
      a.href = target.href;
    } catch (_) {}
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || !a.href) return;
    decorate(a);
    var u; try { u = new URL(a.href); } catch (_) { return; }
    var place = (a.closest('[id]') || {}).id || 'navigation';
    if (u.hostname === 'shop.relegends.cz' && u.pathname.indexOf('/p/') === 0) {
      rlTrack('buy_click', { placement:place, transport_type:'beacon' });
      if (consent.marketing && metaLoaded) fbq('trackSingleCustom', PIXEL, 'ShopClick', { placement:place, content_name:'Mystery Pack', content_category:'Founders Series' });
    } else if (u.hostname === 'instagram.com' || u.hostname === 'www.instagram.com') rlTrack('instagram_click', { placement:place });
    else if (a.closest('.partner')) { var im = a.querySelector('img'); rlTrack('partner_click', { partner:im ? im.alt : a.textContent.trim() }); }
    else if (u.hostname === 'colectio.com') rlTrack('colectio_click', { placement:place });
    else if (u.hostname === 'relegends.cz' && /^\/(auta|katalog-aut)\//.test(u.pathname)) rlTrack('car_story_click', { link:u.origin + u.pathname });
    // A link to Shop is not AddToCart, InitiateCheckout or Purchase.
  }, true);

  function show(settings) {
    if (!box) {
      var css = document.createElement('style');
      css.textContent = '.rl-cc[hidden],.rl-cc [hidden]{display:none!important}.rl-cc{position:fixed;z-index:10000;left:max(16px,env(safe-area-inset-left,0px));right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));max-width:480px;max-height:85dvh;overflow:auto;box-sizing:border-box;background:#fff;color:#111;border:1px solid #ddd;border-radius:16px;box-shadow:0 18px 50px #0003;padding:20px;font:14px/1.55 Poppins,Arial,sans-serif}.rl-cc b{font-size:17px}.rl-cc p{margin:10px 0}.rl-cc a{color:#111;text-decoration:underline}.rl-cc-b{display:flex;gap:8px;flex-wrap:wrap}.rl-cc button{flex:1 1 140px;min-height:46px;border:1px solid #111;border-radius:24px;background:#fff;color:#111;font:600 14px Poppins,Arial,sans-serif;padding:9px 14px;cursor:pointer}.rl-cc .ok{background:#111;color:#fff}.rl-cc button:focus-visible,.rl-cc input:focus-visible{outline:3px solid #e10600;outline-offset:3px}.rl-cc label{display:flex;gap:12px;align-items:center;margin:10px 0}.rl-cc input{width:20px;height:20px;accent-color:#e10600}';
      document.head.appendChild(css);
      box = document.createElement('section'); box.className = 'rl-cc';
      box.setAttribute('role','dialog'); box.setAttribute('aria-label',t[0]);
      box.innerHTML = '<b>' + t[0] + '</b><p>' + t[1] + ' <a href="https://relegends.cz/ochrana-osobnich-udaju/" target="_blank" rel="noopener">' + t[8] + '</a></p><div class="rl-choices" hidden><label><input type="checkbox" name="rl-analytics">' + t[6] + '</label><label><input type="checkbox" name="rl-marketing">' + t[7] + '</label></div><div class="rl-cc-b"><button type="button" class="no">' + t[3] + '</button><button type="button" class="ok">' + t[2] + '</button><button type="button" class="settings">' + t[4] + '</button><button type="button" class="save" hidden>' + t[5] + '</button></div>';
      box.querySelector('.no').onclick = function () { choose(false,false); };
      box.querySelector('.ok').onclick = function () { choose(true,true); };
      box.querySelector('.settings').onclick = function () { show(true); };
      box.querySelector('.save').onclick = function () { choose(box.querySelector('[name="rl-analytics"]').checked, box.querySelector('[name="rl-marketing"]').checked); };
      document.body.appendChild(box);
    }
    box.hidden = false;
    box.querySelector('.rl-choices').hidden = !settings;
    box.querySelector('.save').hidden = !settings;
    box.querySelector('.settings').hidden = !!settings;
    box.querySelector('[name="rl-analytics"]').checked = consent.analytics;
    box.querySelector('[name="rl-marketing"]').checked = consent.marketing;
  }
  function init() {
    document.querySelectorAll('a[href]').forEach(decorate);
    document.querySelectorAll('[data-cookie-settings]').forEach(function (el) { el.addEventListener('click', function (e) { e.preventDefault(); show(true); }); });
    loadGA(); loadMeta();
    if (!saved) show(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
