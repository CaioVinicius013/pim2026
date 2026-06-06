const prices = [149.90, 249.90, 399.90];
const qtys = [1, 1, 1];
let shipCost = 19.90;
let discount = 0;
 
function fmt(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',');
}
 
function updateTotals() {
  const sub = qtys.reduce((acc, q, i) => acc + q * prices[i], 0);
  const total = sub + shipCost - discount;
  document.getElementById('subtotal').textContent = fmt(sub);
  document.getElementById('grandTotal').textContent = fmt(total);
  document.querySelector('.installments strong').textContent =
    '12x de ' + fmt(total / 12 * 1.1594);
  qtys.forEach((q, i) => {
    document.getElementById('qty' + i).textContent = q;
    document.getElementById('price' + i).textContent = fmt(q * prices[i]);
  });
}
 
function changeQty(idx, delta) {
  qtys[idx] = Math.max(1, qtys[idx] + delta);
  updateTotals();
}
 
function selectShip(el, delta) {
  document.querySelectorAll('.shipping-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  const costs = [19.90, 38.90, 0];
  const idx = [...document.querySelectorAll('.shipping-opt')].indexOf(el);
  shipCost = costs[idx];
  document.getElementById('shipLabel').textContent = shipCost === 0 ? 'Grátis' : fmt(shipCost);
  updateTotals();
}
 
function applyCoupon() {
  const code = document.getElementById('couponField').value.trim().toUpperCase();
  const msg = document.getElementById('couponMsg');
  const row = document.getElementById('discountRow');
  msg.style.display = 'block';
  if (code === 'PRIME10') {
    const sub = qtys.reduce((acc, q, i) => acc + q * prices[i], 0);
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
  document.getElementById('successOverlay').classList.add('show');
}
 
// Máscara CPF
document.getElementById('cpfInput').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  this.value = v;
});
 
// Máscara número do cartão
document.getElementById('cardNum').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').substring(0, 16);
  this.value = v.replace(/(.{4})/g, '$1 ').trim();
});
 
// Máscara validade
document.getElementById('cardExp').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
  this.value = v;
});
 
// Máscara CEP
document.getElementById('cepInput').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').substring(0, 8);
  if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5);
  this.value = v;
});
 
// Inicializa os totais ao carregar a página
updateTotals();