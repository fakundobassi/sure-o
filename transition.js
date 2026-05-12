/**
 * transition.js
 * Efecto de transición temático de construcción entre páginas.
 */

(function () {
  const overlay = document.createElement('div');
  overlay.id = 'page-transition-overlay';
  overlay.innerHTML = `
    <div class="transition-stripes"></div>
    <div class="transition-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
        <path d="M8 38 Q8 20 32 18 Q56 20 56 38 Z" fill="#FF6A00" stroke="#000" stroke-width="2"/>
        <rect x="4" y="37" width="56" height="7" rx="3" fill="#FF8C00" stroke="#000" stroke-width="2"/>
        <path d="M24 18 Q32 10 40 18" stroke="#000" stroke-width="2" fill="none"/>
      </svg>
    </div>
    <div class="transition-bar">
      <div class="transition-bar-fill"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Entrada: si venimos de otra página, mostrar y luego esconder el overlay
  if (sessionStorage.getItem('pt_transitioning') === '1') {
    sessionStorage.removeItem('pt_transitioning');
    overlay.style.transform = 'translateY(0%)';
    overlay.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('slide-out');
      });
    });
  }

  // Salida: bajar rayas y navegar
  function navigateTo(url) {
    overlay.classList.remove('slide-out');
    overlay.style.transform = '';
    overlay.style.transition = '';
    void overlay.offsetWidth;
    overlay.classList.add('slide-in');

    const fallback = setTimeout(() => {
      sessionStorage.setItem('pt_transitioning', '1');
      window.location.href = url;
    }, 700);

    overlay.addEventListener('animationend', function onIn(e) {
      if (e.target !== overlay) return;
      clearTimeout(fallback);
      overlay.removeEventListener('animationend', onIn);
      sessionStorage.setItem('pt_transitioning', '1');
      window.location.href = url;
    });
  }

  // Interceptar links de nav
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http')) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        navigateTo(href);
      });
    }
  });

  // Marcar link activo
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Menú hamburguesa
  const menuToggle = document.getElementById('menuToggle');
  const mainNav    = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        mainNav.classList.remove('open');
      });
    });
  }

})();
