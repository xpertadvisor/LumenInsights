(function () {
  'use strict';

  var SUPPORTED_LANGS = ['en', 'zh', 'ms'];
  var LANG_LABELS = { en: 'EN', zh: '\u4e2d\u6587', ms: 'BM' };
  var translationCache = {};

  function getStoredLang() {
    try { return localStorage.getItem('lang'); } catch (e) { return null; }
  }

  function storeLang(lang) {
    try { localStorage.setItem('lang', lang); } catch (e) { /* noop */ }
  }

  function detectLang() {
    var stored = getStoredLang();
    if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;
    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.indexOf('zh') === 0) return 'zh';
    if (nav.indexOf('ms') === 0 || nav.indexOf('may') === 0) return 'ms';
    return 'en';
  }

  function fetchTranslations(lang, cb) {
    if (lang === 'en') return cb(null);
    if (translationCache[lang]) return cb(translationCache[lang]);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'lang/' + lang + '.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          translationCache[lang] = data;
          cb(data);
        } catch (e) { cb(null); }
      } else { cb(null); }
    };
    xhr.onerror = function () { cb(null); };
    xhr.send();
  }

  function applyTranslations(translations) {
    // data-i18n  -> textContent
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      if (translations && translations[key] != null) {
        els[i].textContent = translations[key];
      }
    }
    // data-i18n-html -> innerHTML (safe: only explicitly marked elements)
    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlEls.length; j++) {
      var hkey = htmlEls[j].getAttribute('data-i18n-html');
      if (translations && translations[hkey] != null) {
        htmlEls[j].innerHTML = translations[hkey];
      }
    }
    // data-i18n-attr="attrName:key"
    var attrEls = document.querySelectorAll('[data-i18n-attr]');
    for (var k = 0; k < attrEls.length; k++) {
      var parts = attrEls[k].getAttribute('data-i18n-attr').split(':');
      if (parts.length === 2 && translations && translations[parts[1]] != null) {
        attrEls[k].setAttribute(parts[0], translations[parts[1]]);
      }
    }
    // Update page title and meta description
    var page = document.body.getAttribute('data-page');
    if (page && translations) {
      var titleKey = 'meta.title.' + page;
      var descKey = 'meta.desc.' + page;
      if (translations[titleKey]) document.title = translations[titleKey];
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && translations[descKey]) metaDesc.setAttribute('content', translations[descKey]);
    }
  }

  function resetToEnglish() {
    // For English, we need the en.json to restore original text if switching back from another language
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'lang/en.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          applyTranslations(data);
        } catch (e) { /* noop */ }
      }
    };
    xhr.send();
    // Also update meta
    var page = document.body.getAttribute('data-page');
    if (page) {
      var defaultTitles = {
        home: 'Lumen Insights Pte Ltd | Accounting & Bookkeeping | Singapore',
        about: 'About | Lumen Insights Pte Ltd',
        services: 'Services | Lumen Insights Pte Ltd',
        blog: 'Blog | Lumen Insights Pte Ltd',
        contact: 'Contact | Lumen Insights Pte Ltd'
      };
      if (defaultTitles[page]) document.title = defaultTitles[page];
    }
  }

  function setLang(lang) {
    storeLang(lang);
    document.documentElement.setAttribute('lang', lang);
    updateDropdownLabel(lang);

    if (lang === 'en') {
      resetToEnglish();
      document.body.classList.remove('i18n-loading');
      return;
    }

    document.body.classList.add('i18n-loading');
    fetchTranslations(lang, function (translations) {
      if (translations) applyTranslations(translations);
      document.body.classList.remove('i18n-loading');
    });
  }

  function updateDropdownLabel(lang) {
    var btn = document.querySelector('.lang-switcher-btn');
    if (btn) btn.textContent = LANG_LABELS[lang] || 'EN';
    // Update active state in dropdown
    var items = document.querySelectorAll('.lang-switcher-dropdown a');
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute('data-lang') === lang) {
        items[i].classList.add('active');
      } else {
        items[i].classList.remove('active');
      }
    }
  }

  function buildDropdown() {
    var switcher = document.createElement('div');
    switcher.className = 'lang-switcher';

    var btn = document.createElement('button');
    btn.className = 'lang-switcher-btn';
    btn.setAttribute('aria-label', 'Switch language');
    btn.type = 'button';

    var dropdown = document.createElement('div');
    dropdown.className = 'lang-switcher-dropdown';

    for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
      var a = document.createElement('a');
      a.href = '#';
      a.setAttribute('data-lang', SUPPORTED_LANGS[i]);
      a.textContent = LANG_LABELS[SUPPORTED_LANGS[i]];
      a.addEventListener('click', (function (lang) {
        return function (e) {
          e.preventDefault();
          setLang(lang);
          switcher.classList.remove('open');
        };
      })(SUPPORTED_LANGS[i]));
      dropdown.appendChild(a);
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      switcher.classList.toggle('open');
    });

    switcher.appendChild(btn);
    switcher.appendChild(dropdown);

    // Close dropdown when clicking outside
    document.addEventListener('click', function () {
      switcher.classList.remove('open');
    });

    return switcher;
  }

  function init() {
    var lang = detectLang();
    document.documentElement.setAttribute('lang', lang);

    // Insert language switcher into nav
    var nav = document.querySelector('.main-nav');
    if (nav) {
      var dropdown = buildDropdown();
      nav.appendChild(dropdown);
      updateDropdownLabel(lang);
    }

    // Apply translations if not English
    if (lang !== 'en') {
      document.body.classList.add('i18n-loading');
      fetchTranslations(lang, function (translations) {
        if (translations) applyTranslations(translations);
        document.body.classList.remove('i18n-loading');
      });
    }
  }

  // Expose for blog page dynamic content
  window.__i18n = {
    getTranslation: function (key) {
      var lang = getStoredLang() || 'en';
      if (lang === 'en' || !translationCache[lang]) return null;
      return translationCache[lang][key] || null;
    },
    getCurrentLang: function () {
      return getStoredLang() || 'en';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
