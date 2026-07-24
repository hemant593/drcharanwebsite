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

  /* Active nav link on scroll — homepage only. Other pages set the
     active class server-side (in the markup) and keep it fixed. */
  var isHomePage = /(^|\/)(index\.html)?$/.test(window.location.pathname);

  if (isHomePage) {
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
                  link.getAttribute("href") === "#" + id ||
                    link.getAttribute("href") === "index.html#" + id
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
  }

  /* Contact form validation (front-end only, no backend attached) */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    var statusEl = document.getElementById("formStatus");

    var validators = {
      fullName: function (v) {
        return v.trim().length >= 2 ? "" : "Enter your full name.";
      },
      email: function (v) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(v.trim()) ? "" : "Enter a valid email address.";
      },
      phone: function (v) {
        if (!v.trim()) return "";
        var re = /^[0-9+()\-\s]{6,}$/;
        return re.test(v.trim()) ? "" : "Enter a valid phone number.";
      },
      message: function (v) {
        return v.trim().length >= 10
          ? ""
          : "Add a few more details (10+ characters).";
      },
    };

    var setFieldError = function (field, message) {
      var wrap = field.closest(".form-field");
      var errorEl = document.getElementById("err-" + field.id);
      if (wrap) wrap.classList.toggle("has-error", !!message);
      if (errorEl) errorEl.textContent = message;
    };

    var validateField = function (field) {
      var validator = validators[field.name];
      if (!validator) return true;
      var message = validator(field.value);
      setFieldError(field, message);
      return !message;
    };

    ["fullName", "email", "phone", "message"].forEach(function (name) {
      var field = contactForm.elements[name];
      if (field) {
        field.addEventListener("blur", function () {
          validateField(field);
        });
        field.addEventListener("input", function () {
          if (field.closest(".form-field").classList.contains("has-error")) {
            validateField(field);
          }
        });
      }
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = ["fullName", "email", "phone", "message"].map(
        function (name) {
          return contactForm.elements[name];
        }
      );
      var allValid = fields
        .map(function (field) {
          return validateField(field);
        })
        .every(Boolean);

      if (!allValid) {
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.className = "form-status error";
        return;
      }

      // No backend is wired up yet — this simply confirms the form
      // works client-side. Connect it to your booking system or an
      // email endpoint to actually send messages.
      statusEl.textContent =
        "Thanks — your message looks good and is ready to send once this form is connected to a backend.";
      statusEl.className = "form-status success";
      contactForm.reset();
    });
  }
})();
