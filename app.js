(function () {
  'use strict';
  var doc = document;

  /* Мобільне меню */
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('site-nav');
  var header = doc.getElementById('site-header');

  function setOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Закрити меню' : 'Меню');
    nav.classList.toggle('is-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setOpen(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    var mq = window.matchMedia('(min-width:1080px)');
    var onMq = function () { setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    else if (mq.addListener) mq.addListener(onMq);
  }

  /* Тінь шапки під час прокручування */
  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Підсвічування поточного розділу в меню */
  var links = [].slice.call(doc.querySelectorAll('.site-nav a[href^="#"]'));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window && links.length) {
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = byId[entry.target.id] || null;
        if (current && current !== link) current.removeAttribute('aria-current');
        if (link) link.setAttribute('aria-current', 'true');
        current = link;
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    [].slice.call(doc.querySelectorAll('main > section[id]')).forEach(function (s) { io.observe(s); });
  }

  /* Позначка події: «Найближча» змінюється на «Нещодавня» після дати проведення */
  var now = Date.now();
  [].slice.call(doc.querySelectorAll('[data-event-date]')).forEach(function (card) {
    var end = Date.parse(card.getAttribute('data-event-date') + 'T23:59:59+03:00');
    if (!isNaN(end) && now > end) {
      [].slice.call(card.querySelectorAll('[data-event-label]')).forEach(function (el) {
        el.textContent = el.getAttribute('data-label-past');
      });
    }
  });

  /* Напрями конференції: на широких екранах список відкрито одразу */
  if (window.matchMedia && window.matchMedia('(min-width:760px)').matches) {
    [].slice.call(doc.querySelectorAll('details[data-open-wide]')).forEach(function (d) { d.open = true; });
  }

  /* Рік у підвалі */
  [].slice.call(doc.querySelectorAll('[data-year]')).forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
