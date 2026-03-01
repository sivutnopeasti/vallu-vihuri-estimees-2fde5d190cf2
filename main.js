/* ============================================
   VALLU&VIHURI ESTIMEES – main.js
   ============================================ */

'use strict';

/* ---------- NAVIGAATIO: SCROLL-VARJO ---------- */
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ---------- HAMPURILAISVALIKKO ---------- */
(function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const openMenu = () => {
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Sulje kun klikataan linkkiä
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Sulje ESC-näppäimellä
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      hamburger.focus();
    }
  });

  // Sulje kun klikataan valikon ulkopuolelle
  document.addEventListener('click', e => {
    if (
      hamburger.getAttribute('aria-expanded') === 'true' &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });
})();


/* ---------- SMOOTH SCROLL ANKKURILINKEILLE ---------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.site-header')?.offsetHeight ?? 70;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();


/* ---------- SCROLL REVEAL ---------- */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.palvelu-card, .galleria-item, .prosessi-step, .yhteys-item, .fakta-item, .meista-teksti, .section-header, .palvelut-cta, .yhteys-huomio, .lomake-wrapper, .meista-visual'
  );

  if (!revealElements.length) return;

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => observer.observe(el));
})();


/* ---------- LOMAKKEEN LÄHETYS ---------- */
(function initForm() {
  const form = document.querySelector('.yhteydenotto-lomake');
  const successMsg = document.getElementById('success-msg');
  const errorMsg = document.getElementById('error-msg');
  const submitBtn = form?.querySelector('.btn-submit');

  if (!form || !successMsg || !errorMsg || !submitBtn) return;

  const showMessage = (el, show) => {
    el.hidden = !show;
  };

  const setLoading = (loading) => {
    submitBtn.classList.toggle('loading', loading);
    submitBtn.disabled = loading;
    submitBtn.setAttribute('aria-busy', loading ? 'true' : 'false');
  };

  const resetMessages = () => {
    showMessage(successMsg, false);
    showMessage(errorMsg, false);
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    resetMessages();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setLoading(true);

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        showMessage(successMsg, true);
        form.reset();
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        showMessage(errorMsg, true);
      }
    } catch {
      showMessage(errorMsg, true);
    } finally {
      setLoading(false);
    }
  });

  // Reaaliaikainen kenttävalidointi
  form.querySelectorAll('.lomake-input').forEach(input => {
    input.addEventListener('blur', () => {
      if (input.required && !input.value.trim()) {
        input.style.borderColor = '#e05252';
      } else if (input.type === 'email' && input.value && !input.value.includes('@')) {
        input.style.borderColor = '#e05252';
      } else {
        input.style.borderColor = '';
      }
    });

    input.addEventListener('input', () => {
      input.style.borderColor = '';
    });
  });
})();


/* ---------- AKTIIVINEN NAV-LINKKI SCROLLATESSA ---------- */
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const headerHeight = document.querySelector('.site-header')?.offsetHeight ?? 70;

  const onScroll = () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 80;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ---------- GALLERIAKUVIEN HOVER-CAPTION MOBIILISSA ---------- */
(function initGalleriaTouch() {
  if (window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.galleria-item').forEach(item => {
      const caption = item.querySelector('.galleria-caption');
      if (!caption) return;

      caption.style.opacity = '1';
      caption.style.transform = 'translateY(0)';
    });
  }
})();


/* ---------- PALVELUKORTTIEN STAGGERED ANIMAATIO ---------- */
(function initStaggeredCards() {
  const cards = document.querySelectorAll('.palvelu-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });
})();