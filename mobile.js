document.addEventListener('DOMContentLoaded', () => {

  const hamburger        = document.getElementById('hamburger');
  const navbar           = document.getElementById('mainNavbar');
  const cartBtnMobile    = document.getElementById('cartBtnMobile');
  const navbarUserMobile = document.getElementById('navbarUserMobile');
  const usuario          = JSON.parse(localStorage.getItem('usuarioLogado'));

  // --- Hamburger toggle ---
  if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navbar.classList.toggle('open');
    });
    navbar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navbar.classList.remove('open');
      });
    });
  }

  // --- Carrinho mobile: só mostra se estiver logado e em tela <= 768px ---
  function checkMobileCart() {
    if (!cartBtnMobile) return;
    if (window.innerWidth <= 768 && usuario) {
      cartBtnMobile.style.display = 'block';
    } else {
      cartBtnMobile.style.display = 'none';
    }
  }

  checkMobileCart();
  window.addEventListener('resize', checkMobileCart);

  // --- Menu mobile: links diferentes para logado / deslogado ---
  if (navbarUserMobile) {
    if (usuario) {
      navbarUserMobile.innerHTML = `
        <span style="color:#d4af37;padding:10px 0;display:block;">👤 ${usuario.email}</span>
        <button id="logoutMobileBtn" style="color:#fff;background:none;border:none;font-family:inherit;font-size:0.95rem;padding:10px 0;cursor:pointer;text-align:left;">Sair</button>
      `;
      document.getElementById('logoutMobileBtn')?.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.reload();
      });
    } else {
      navbarUserMobile.innerHTML = `
        <a href="cadastrotest.html" style="display:block;padding:10px 0;color:#fff;border-bottom:1px solid rgba(255,255,255,0.05);">Cadastrar</a>
        <a href="login.html" style="display:block;padding:10px 0;color:#d4af37;">Login</a>
      `;
    }
  }

  // --- Badge do carrinho mobile ---
  function updateMobileBadge() {
    const cart  = JSON.parse(localStorage.getItem('primeoutfit_cart') || '[]');
    const total = cart.reduce((acc, i) => acc + i.qty, 0);
    const badge = document.getElementById('cartBadgeMobile');
    if (badge) {
      badge.textContent    = total;
      badge.style.display  = total > 0 ? 'flex' : 'none';
    }
  }

  updateMobileBadge();
  window.addEventListener('storage', updateMobileBadge);

});