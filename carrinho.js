const CART_KEY = 'primeoutfit_cart';
 
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
 
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
 
function addToCart(name, price, img) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }
  saveCart(cart);
  showCartFeedback();
  updateCartBadge();
}
 
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((acc, i) => acc + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
}
 
function showCartFeedback() {
  const fb = document.getElementById('cartFeedback');
  if (!fb) return;
  fb.classList.add('show');
  setTimeout(() => fb.classList.remove('show'), 2000);
}
 
// Ao carregar o index, atualiza o badge do carrinho
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
 
  // Atribui o evento de "Comprar" a cada botão de produto
  document.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('button');
    const name = card.querySelector('h3').textContent;
    const priceText = card.querySelector('span').textContent;
    const price = parseFloat(
      priceText.replace('R$', '').replace('.', '').replace(',', '.').trim()
    );
    const img = card.querySelector('img').src;
 
    btn.addEventListener('click', () => addToCart(name, price, img));
  });
});