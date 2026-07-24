(function () {
  "use strict";

  /* Mobile nav toggle */
  var hamburger = document.getElementById("hamburger");
  var mainNav = document.getElementById("mainNav");

  if (hamburger && mainNav) {
    hamburger.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
      });
    });
  }

  /* Sticky header shadow on scroll */
  var header = document.getElementById("siteHeader");
  if (header) {
    var applyHeaderState = function () {
      if (window.scrollY > 8) {
        header.style.boxShadow = "0 12px 30px -20px rgba(15,42,99,0.45)";
      } else {
        header.style.boxShadow = "none";
      }
    };
    applyHeaderState();
    window.addEventListener("scroll", applyHeaderState, { passive: true });
  }

  /* Scroll-reveal animations */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Active nav link on scroll */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".main-nav a");
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + id
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }
})();
