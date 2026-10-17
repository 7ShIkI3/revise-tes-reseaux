(function () {
  'use strict';
  const key = 'revise-reseaux:theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try {
    const stored = localStorage.getItem(key);
    if (stored === 'light' || stored === 'dark') preference = stored;
  } catch (_) { /* The theme remains usable when browser storage is unavailable. */ }
  const symbols = {
    dark: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 14.4A9 9 0 0 1 9.6 3.4 9 9 0 1 0 20.6 14.4Z"/></svg>',
    light: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>'
  };
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d1725' : '#f5f7fa');
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const target = theme === 'dark' ? 'light' : 'dark';
    const label = target === 'dark' ? 'Mode sombre' : 'Mode clair';
    button.setAttribute('aria-label', 'Activer le ' + label.toLowerCase());
    button.title = 'Activer le ' + label.toLowerCase();
    document.getElementById('theme-label').textContent = label;
    document.getElementById('theme-symbol').innerHTML = symbols[target];
  }
  function preferred() { return preference || (system.matches ? 'dark' : 'light'); }
  apply(preferred());
  function bind() {
    apply(preferred());
    document.getElementById('theme-toggle')?.addEventListener('click', function () {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(preference);
      try { localStorage.setItem(key, preference); } catch (_) { /* Session-only fallback. */ }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
  system.addEventListener('change', function () { if (!preference) apply(preferred()); });
  window.addEventListener('storage', function (event) {
    if (event.key !== key) return;
    preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    apply(preferred());
  });
}());
