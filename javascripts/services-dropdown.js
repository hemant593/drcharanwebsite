// Mobile "Services" dropdown accordion behavior
(function () {
  var item = document.getElementById('servicesNavItem');
  var toggle = document.getElementById('servicesToggle');
  var mainNav = document.getElementById('mainNav');
  var hamburger = document.getElementById('hamburger');
  if (!item || !toggle || !mainNav) return;

  // True only while the user is actively interacting with the Services
  // toggle. Used to tell the difference between "menu closed because the
  // user tapped Services" (should stay open) and "menu closed for a real
  // reason, e.g. hamburger tap" (should collapse the submenu).
  var handlingServicesClick = false;

  function forceNavOpen() {
    if (!mainNav.classList.contains('is-open')) {
      mainNav.classList.add('is-open');
    }
  }

  toggle.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      handlingServicesClick = true;

      var isOpen = item.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      // Safety net: some script.js logic may close the whole mobile nav
      // as a side effect of this click (e.g. a generic "close menu on
      // any nav link click" handler that runs before/after this one).
      // If that happens, force it back open — this click should only
      // affect the Services submenu, never the whole menu.
      forceNavOpen();
      setTimeout(forceNavOpen, 0);
      setTimeout(function () {
        forceNavOpen();
        handlingServicesClick = false;
      }, 60);
    }
  });

  // Collapse the submenu whenever the mobile nav is closed for a real
  // reason (hamburger tap, outside click, etc.) — but not when it was
  // the Services click itself that we just forced back open above.
  var observer = new MutationObserver(function () {
    if (!mainNav.classList.contains('is-open') && !handlingServicesClick) {
      item.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  observer.observe(mainNav, { attributes: true, attributeFilter: ['class'] });

  // Also explicitly reset when the hamburger itself is used to close.
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      setTimeout(function () {
        if (!mainNav.classList.contains('is-open')) {
          item.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }, 0);
    });
  }
})();