/* MJ Media site — small bits of behaviour. No dependencies. */

(function () {
  'use strict';

  /* Current year in the footer */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Header shadow once you start scrolling */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');

  var closeNav = function () {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* Fade sections in as they come into view */
  var items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* Quote form: builds an email in the visitor's own mail app.
     No server needed, so nothing can silently fail to send. */
  var form = document.getElementById('quote-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = new FormData(form);
    var name = (data.get('name') || '').toString().trim();
    var contact = (data.get('contact') || '').toString().trim();
    var type = (data.get('type') || '').toString();
    var details = (data.get('details') || '').toString().trim();

    var body = [
      'Hi MJ Media,',
      '',
      'I would like a quote for: ' + type,
      '',
      details || '(details)',
      '',
      '—',
      name,
      contact
    ].join('\n');

    window.location.href = 'mailto:art@mediamj.com' +
      '?subject=' + encodeURIComponent('Quote request: ' + type) +
      '&body=' + encodeURIComponent(body);
  });
})();
