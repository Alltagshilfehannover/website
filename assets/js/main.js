/* =========================================================================
   Alltagshilfe Hannover – Interaktivität
   ========================================================================= */
(function () {
  'use strict';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------- Jahr im Footer -------------------------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ------------------------------ Mobile-Menü --------------------------- */
  var toggle = $('.nav__toggle');
  if (toggle) {
    var close = function () { document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    var overlay = $('.mobile-nav__overlay');
    if (overlay) overlay.addEventListener('click', close);
    $$('.mobile-nav a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* -------------------------- Mobile-Akkordeon -------------------------- */
  $$('.m-acc__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.nextElementSibling;
      var open = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------------------- Desktop-Dropdown per Klick -------------------- */
  $$('.nav__item--has-menu > .nav__link').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var item = btn.parentElement;
      var wasOpen = item.classList.contains('nav__item--open');
      $$('.nav__item--open').forEach(function (i) { i.classList.remove('nav__item--open'); });
      if (!wasOpen) item.classList.add('nav__item--open');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__item--has-menu')) {
      $$('.nav__item--open').forEach(function (i) { i.classList.remove('nav__item--open'); });
    }
  });

  /* ---------------------------- Pflegegrad-Tabs ------------------------- */
  var pgTabs = $$('.pg-tab');
  if (pgTabs.length) {
    pgTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-pg');
        pgTabs.forEach(function (t) { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab); });
        $$('.pg-panel').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-pg') === id); });
      });
    });
  }

  /* -------------------------- Testimonial-Slider ------------------------ */
  var track = $('.tst__track');
  if (track) {
    var cards = $$('.tcard', track);
    var dotsWrap = $('.tst__dots');
    var prev = $('.tst__btn--prev');
    var next = $('.tst__btn--next');

    if (dotsWrap) {
      cards.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'tst__dot' + (i === 0 ? ' active' : '');
        d.type = 'button';
        d.setAttribute('aria-label', 'Bewertung ' + (i + 1));
        d.addEventListener('click', function () { scrollToCard(i); });
        dotsWrap.appendChild(d);
      });
    }
    var dots = $$('.tst__dot', dotsWrap);

    function scrollToCard(i) {
      var card = cards[i];
      if (!card) return;
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft - 4, behavior: 'smooth' });
    }
    function current() {
      var min = Infinity, idx = 0;
      cards.forEach(function (c, i) {
        var d = Math.abs(c.offsetLeft - track.scrollLeft - track.offsetLeft);
        if (d < min) { min = d; idx = i; }
      });
      return idx;
    }
    function sync() {
      var i = current();
      dots.forEach(function (d, di) { d.classList.toggle('active', di === i); });
    }
    var raf;
    track.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); });
    if (prev) prev.addEventListener('click', function () { scrollToCard(Math.max(0, current() - 1)); });
    if (next) next.addEventListener('click', function () { scrollToCard(Math.min(cards.length - 1, current() + 1)); });
  }

  /* ------------------------------ FAQ: nur eine offen ------------------- */
  var faqItems = $$('.faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) faqItems.forEach(function (o) { if (o !== item) o.open = false; });
    });
  });

  /* ------------------------------- Cookie-Banner ------------------------ */
  var cookie = $('.cookie');
  if (cookie) {
    var KEY = 'ah_cookie_consent';
    var stored;
    try { stored = localStorage.getItem(KEY); } catch (e) { stored = '1'; }
    if (!stored) { setTimeout(function () { cookie.classList.add('show'); }, 900); }
    function decide(v) {
      try { localStorage.setItem(KEY, v); } catch (e) {}
      cookie.classList.remove('show');
    }
    var acc = $('.cookie__accept'); var dec = $('.cookie__decline');
    if (acc) acc.addEventListener('click', function () { decide('accept'); });
    if (dec) dec.addEventListener('click', function () { decide('decline'); });
  }

  /* ------------------------------ Kontaktformular ----------------------- */
  var form = $('.form');
  if (form) {
    var cfg        = window.SITE_CONFIG || {};
    var btn        = form.querySelector('button[type="submit"]');
    var btnDefault = btn ? btn.textContent : 'Jetzt kostenlos anfragen';
    var okBox      = $('.form__ok', form);
    var consentBox = $('.form__error', form);      // Hinweis zur Einwilligung
    var sendErrBox = $('.form__senderror', form);  // technischer Sendefehler

    function resetBtn()   { if (btn) { btn.disabled = false; btn.textContent = btnDefault; } }
    function hide(el)     { if (el) el.style.display = 'none'; }
    function show(el)     { if (el) el.style.display = 'block'; }
    function succeed()    { show(okBox); hide(sendErrBox); form.reset(); resetBtn(); if (okBox) okBox.scrollIntoView({block:'nearest',behavior:'smooth'}); }
    function failSend()   { show(sendErrBox); resetBtn(); }

    function mailtoUrl(data) {
      var to = form.getAttribute('data-mailto') || cfg.FALLBACK_EMAIL || '';
      var lines = [
        'Name: '       + (data.get('vorname') || '') + ' ' + (data.get('nachname') || ''),
        'Telefon: '    + (data.get('telefon') || ''),
        'E-Mail: '     + (data.get('email') || ''),
        'Ort: '        + (data.get('ort') || ''),
        'Pflegegrad: ' + (data.get('pflegegrad') || 'keine Angabe'),
        '', 'Nachricht:', (data.get('nachricht') || '')
      ];
      return 'mailto:' + to + '?subject=' + encodeURIComponent('Anfrage über die Website')
        + '&body=' + encodeURIComponent(lines.join('\n'));
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // 1) Einwilligung (Pflicht)
      var consent = form.querySelector('input[type="checkbox"][required]');
      if (consent && !consent.checked) { show(consentBox); consent.focus(); return; }
      hide(consentBox); hide(sendErrBox); hide(okBox);

      // 2) Spam-Honeypot – von Bots ausgefüllt, von Menschen nie
      var hp = form.querySelector('[name="_hp"]');
      if (hp && hp.value) { succeed(); return; }

      var data = new FormData(form);

      // 3a) Supabase (wenn konfiguriert): Anfrage in der Datenbank speichern
      if (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
        if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet …'; }
        var payload = {
          vorname:    data.get('vorname')    || '',
          nachname:   data.get('nachname')   || '',
          telefon:    data.get('telefon')    || '',
          email:      data.get('email')      || '',
          ort:        data.get('ort')        || '',
          pflegegrad: data.get('pflegegrad') || '',
          nachricht:  data.get('nachricht')  || '',
          quelle:     (location.pathname.replace(/^.*\//, '') || 'index.html')
        };
        fetch(cfg.SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/' + (cfg.CONTACT_TABLE || 'kontaktanfragen'), {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'apikey':        cfg.SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + cfg.SUPABASE_ANON_KEY,
            'Prefer':        'return=minimal'
          },
          body: JSON.stringify(payload)
        })
        .then(function (r) { if (r.ok) succeed(); else failSend(); })
        .catch(function () { failSend(); });
        return;
      }

      // 3b) Fallback ohne Backend: E-Mail-Programm öffnen
      if (btn) { btn.disabled = true; btn.textContent = 'E-Mail-Programm wird geöffnet …'; }
      window.location.href = mailtoUrl(data);
      setTimeout(succeed, 900);
    });
  }

  /* ----------------------------- Scroll-Reveal -------------------------- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  }

  /* -------------------- Header-Schatten beim Scrollen ------------------- */
  var header = $('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
