const CART_KEY = 'primeoutfit_cart';
 
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
 
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
 
// ---- Renderiza os itens do carrinho ----
function renderCart() {
  const cart = getCart();
  const container = document.getElementById('orderItems');
  container.innerHTML = '';
 
  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:30px 0;color:var(--muted);">
        <p style="font-size:2rem;margin-bottom:10px;">🛒</p>
        <p>Seu carrinho está vazio.</p>
        <a href="index.html" style="color:var(--gold);font-size:0.85rem;">← Voltar às compras</a>
      </div>`;
    updateTotals();
    return;
  }
 
  cart.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
      <img class="item-img" src="${item.img}" alt="${item.name}" />
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-variant" style="color:var(--muted);font-size:0.75rem;">R$ ${item.price.toFixed(2).replace('.',',')} / un.</div>
        <div class="item-qty">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
          <span class="qty-count" id="qty${idx}">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
        <div class="item-price" id="price${idx}">${fmt(item.price * item.qty)}</div>
        <button onclick="removeItem(${idx})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.75rem;transition:color 0.2s;" onmouseover="this.style.color='#e05555'" onmouseout="this.style.color='var(--muted)'">✕ remover</button>
      </div>`;
    container.appendChild(div);
  });
 
  updateTotals();
}
 
function changeQty(idx, delta) {
  const cart = getCart();
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart(cart);
  renderCart();
}
 
function removeItem(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  renderCart();
}
 
// ---- Totais ----
let shipCost = 19.90;
let discount = 0;
 
function fmt(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',');
}
 
function updateTotals() {
  const cart = getCart();
  const sub = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const total = sub + shipCost - discount;
 
  document.getElementById('subtotal').textContent = fmt(sub);
  document.getElementById('grandTotal').textContent = fmt(total);
  const inst = document.querySelector('.installments strong');
  if (inst) inst.textContent = '12x de ' + fmt(total / 12 * 1.1594);
 
  // Botão confirmar: desabilita se carrinho vazio
  const btn = document.querySelector('.btn-confirm');
  if (btn) {
    btn.disabled = cart.length === 0;
    btn.style.opacity = cart.length === 0 ? '0.4' : '1';
    btn.style.cursor = cart.length === 0 ? 'not-allowed' : 'pointer';
  }
}
 
function selectShip(el) {
  document.querySelectorAll('.shipping-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  const costs = [19.90, 38.90, 0];
  const idx = [...document.querySelectorAll('.shipping-opt')].indexOf(el);
  shipCost = costs[idx];
  document.getElementById('shipLabel').textContent = shipCost === 0 ? 'Grátis' : fmt(shipCost);
  updateTotals();
}
 
function applyCoupon() {
  const cart = getCart();
  const code = document.getElementById('couponField').value.trim().toUpperCase();
  const msg = document.getElementById('couponMsg');
  const row = document.getElementById('discountRow');
  msg.style.display = 'block';
  if (code === 'PRIME10') {
    const sub = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
    discount = sub * 0.10;
    document.getElementById('discountVal').textContent = '− ' + fmt(discount);
    row.style.display = 'flex';
    msg.style.color = '#4caf50';
    msg.textContent = 'Cupom aplicado! 10% de desconto.';
  } else if (code === '') {
    msg.style.color = '#e05555';
    msg.textContent = 'Digite um código de cupom.';
  } else {
    msg.style.color = '#e05555';
    msg.textContent = 'Cupom inválido ou expirado.';
    discount = 0;
    row.style.display = 'none';
  }
  updateTotals();
}
 
function showPayment(type, btn) {
  document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panelCard').style.display = type === 'card' ? 'block' : 'none';
  document.getElementById('panelPix').classList.toggle('visible', type === 'pix');
  document.getElementById('panelBoleto').classList.toggle('visible', type === 'boleto');
}
 
function copyPix() {
  const code = document.querySelector('.pix-code').textContent;
  navigator.clipboard.writeText(code).catch(() => {});
  const btn = document.querySelector('#panelPix .btn-copy');
  btn.textContent = 'Copiado!';
  setTimeout(() => btn.textContent = 'Copiar código Pix', 2000);
}
 
function copyBoleto() {
  navigator.clipboard.writeText('7891 2345 6789 0 1234 5678 9012 3 4567 8901 2345 6 78').catch(() => {});
  const btn = document.querySelector('#panelBoleto .btn-copy');
  btn.textContent = 'Copiado!';
  setTimeout(() => btn.textContent = 'Copiar linha digitável', 2000);
}
 
function confirmOrder() {
  const cart = getCart();
  if (cart.length === 0) return;
  localStorage.removeItem(CART_KEY); // limpa o carrinho após compra
  document.getElementById('successOverlay').classList.add('show');
}
 
// ---- Máscaras ----
document.getElementById('cpfInput').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  this.value = v;
});
 
document.getElementById('cardNum').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').substring(0, 16);
  this.value = v.replace(/(.{4})/g, '$1 ').trim();
});
 
document.getElementById('cardExp').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
  this.value = v;
});
 
document.getElementById('cepInput').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').substring(0, 8);
  if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5);
  this.value = v;
});
 
// ---- Init ----
document.addEventListener('DOMContentLoaded', renderCart);