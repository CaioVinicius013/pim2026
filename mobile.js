// =============================================
// MOBILE.JS — Hamburger menu + carrinho mobile
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.getElementById('hamburger');
  const navbar    = document.getElementById('mainNavbar');
  const cartBtnMobile = document.getElementById('cartBtnMobile');

  // --- Hamburger toggle ---
  if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navbar.classList.toggle('open');
    });

    // Fecha menu ao clicar em link
    navbar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navbar.classList.remove('open');
      });
    });
  }

  // --- Carrinho mobile: só mostra em telas <= 768px ---
  function checkMobileCart() {
    if (!cartBtnMobile) return;
    if (window.innerWidth <= 768) {
      cartBtnMobile.style.display = 'block';
    } else {
      cartBtnMobile.style.display = 'none';
    }
  }

  checkMobileCart();
  window.addEventListener('resize', checkMobileCart);

  // --- Integração com auth.js: atualiza menu mobile quando logado ---
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  const navbarUserMobile = document.getElementById('navbarUserMobile');

  if (usuario && navbarUserMobile) {
    navbarUserMobile.innerHTML = `
      <span style="color:#d4af37;padding:10px 0;display:block;">👤 ${usuario.email}</span>
      <button id="logoutMobileBtn" style="color:#fff;background:none;border:none;font-family:inherit;font-size:0.95rem;padding:10px 0;cursor:pointer;text-align:left;">Sair</button>
    `;

    document.getElementById('logoutMobileBtn')?.addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.reload();
    });
  }

  // --- Atualiza badge do carrinho mobile ---
  function updateMobileBadge() {
    const cart = JSON.parse(localStorage.getItem('primeoutfit_cart') || '[]');
    const total = cart.reduce((acc, i) => acc + i.qty, 0);
    const badge = document.getElementById('cartBadgeMobile');
    if (badge) {
      badge.textContent = total;
      badge.style.display = total > 0 ? 'flex' : 'none';
    }
  }

  updateMobileBadge();

  // Atualiza badge quando carrinho muda (ex: após addToCart)
  window.addEventListener('storage', updateMobileBadge);

  // Patch: chama updateMobileBadge após addToCart
  const origSaveCart = window.saveCart;
  if (typeof origSaveCart === 'function') {
    window.saveCart = function(cart) {
      origSaveCart(cart);
      updateMobileBadge();
    };
  }

});
