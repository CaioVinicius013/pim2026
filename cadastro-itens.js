let products = JSON.parse(localStorage.getItem('po_products') || '[]');
let currentImageBase64 = '';
let currentImageName   = '';

const form          = document.getElementById('productForm');
const editIndex      = document.getElementById('editIndex');
const btnText        = document.getElementById('btnText');
const btnSpin        = document.getElementById('btnSpin');
const submitBtn      = document.getElementById('submitBtn');
const clearBtn       = document.getElementById('clearBtn');
const previewImg    = document.getElementById('previewImg');
const uploadZone    = document.getElementById('uploadZone');
const uploadIdle    = document.getElementById('uploadIdle');
const uploadPreview = document.getElementById('uploadPreview');
const fileInput      = document.getElementById('imagem');
const removeImg      = document.getElementById('removeImg');
const listEl         = document.getElementById('productList');
const listCount      = document.getElementById('listCount');
const toast          = document.getElementById('toast');

uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });

uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  const imgError = document.getElementById('imgError');
  if (!file.type.startsWith('image/')) {
    imgError.textContent = 'Arquivo inválido. Use PNG, JPG ou WEBP.';
    document.getElementById('f-imagem').classList.add('invalid');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    imgError.textContent = 'Imagem muito grande. Máximo 5 MB.';
    document.getElementById('f-imagem').classList.add('invalid');
    return;
  }
  document.getElementById('f-imagem').classList.remove('invalid');

  currentImageName = file.name;
  document.getElementById('imagemPath').value = 'imagens/' + file.name;

  const reader = new FileReader();
  reader.onload = ev => {
    currentImageBase64 = ev.target.result;
    previewImg.src = currentImageBase64;
    uploadIdle.style.display = 'none';
    uploadPreview.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

removeImg.addEventListener('click', e => {
  e.stopPropagation();
  clearImage();
});

function clearImage() {
  currentImageBase64 = '';
  currentImageName   = '';
  previewImg.src = '';
  fileInput.value = '';
  document.getElementById('imagemPath').value = '';
  uploadPreview.style.display = 'none';
  uploadIdle.style.display = '';
}

function validate() {
  let ok = true;
  const rules = [
    { id: 'nome',      field: 'f-nome',      fn: v => v.trim() !== '' },
    { id: 'categoria', field: 'f-categoria', fn: v => v !== '' },
    { id: 'estoque',   field: 'f-estoque',   fn: v => v !== '' && Number(v) >= 0 },
    { id: 'preco',     field: 'f-preco',     fn: v => v !== '' && Number(v) >= 0 },
  ];
  rules.forEach(r => {
    const el = document.getElementById(r.id);
    const fd = document.getElementById(r.field);
    if (!r.fn(el.value)) { fd.classList.add('invalid'); ok = false; }
    else fd.classList.remove('invalid');
  });
  return ok;
}

['nome','categoria','estoque','preco'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById('f-' + id)?.classList.remove('invalid');
  });
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validate()) { showToast('Preencha os campos obrigatórios.', 'error'); return; }

  btnText.style.display = 'none';
  btnSpin.style.display = 'block';
  submitBtn.disabled = true;
  await new Promise(r => setTimeout(r, 600));

  const product = {
    nome:        document.getElementById('nome').value.trim(),
    categoria:   document.getElementById('categoria').value,
    estoque:     Number(document.getElementById('estoque').value),
    preco:       Number(document.getElementById('preco').value),
    descricao:   document.getElementById('descricao').value.trim(),
    imagem:      currentImageBase64,
    imagemPath: document.getElementById('imagemPath').value,
    ativo:       document.getElementById('ativo').checked,
    dt:          new Date().toISOString(),
  };

  const idx = editIndex.value;
  if (idx !== '') {
    products[Number(idx)] = product;
    showToast('Produto atualizado!', 'success');
  } else {
    products.unshift(product);
    showToast('Produto cadastrado!', 'success');
  }

  saveAndRender();
  resetForm();
  btnText.style.display = '';
  btnSpin.style.display = 'none';
  submitBtn.disabled = false;
});

clearBtn.addEventListener('click', resetForm);

function resetForm() {
  form.reset();
  editIndex.value = '';
  btnText.textContent = 'Salvar Produto';
  clearImage();
  ['f-nome','f-categoria','f-estoque','f-preco'].forEach(id => {
    document.getElementById(id)?.classList.remove('invalid');
  });
}

function saveAndRender() {
  localStorage.setItem('po_products', JSON.stringify(products));
  renderList();
}

function renderList() {
  listCount.textContent = `${products.length} produto${products.length !== 1 ? 's' : ''}`;
  if (products.length === 0) {
    listEl.innerHTML = '<div class="empty-state">Nenhum produto cadastrado</div>';
    return;
  }
  listEl.innerHTML = products.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 40}ms">
      <div class="card-thumb">
        ${p.imagem
          ? `<img src="${p.imagem}" onerror="this.style.display='none'" alt="${p.nome}">`
          : '<span>SEM<br>IMG</span>'}
      </div>
      <div class="card-info">
        <div class="card-name">${p.nome}
          <span class="badge ${p.ativo ? '' : 'off'}"></span>
        </div>
        <div class="card-meta">
          <span class="card-cat">${p.categoria}</span>
          <span class="card-price">R$ ${Number(p.preco).toFixed(2).replace('.',',')}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="icon-btn" onclick="editProduct(${i})" title="Editar">✏</button>
        <button class="icon-btn del" onclick="deleteProduct(${i})" title="Excluir">✕</button>
      </div>
    </div>
  `).join('');
}

window.editProduct = i => {
  const p = products[i];
  document.getElementById('nome').value       = p.nome;
  document.getElementById('categoria').value  = p.categoria;
  document.getElementById('estoque').value    = p.estoque;
  document.getElementById('preco').value      = p.preco;
  document.getElementById('descricao').value  = p.descricao;
  document.getElementById('imagemPath').value = p.imagemPath || '';
  document.getElementById('ativo').checked    = p.ativo;
  editIndex.value = i;
  btnText.textContent = 'Atualizar Produto';

  if (p.imagem) {
    currentImageBase64 = p.imagem;
    currentImageName   = p.imagemPath ? p.imagemPath.split('/').pop() : '';
    previewImg.src = p.imagem;
    uploadIdle.style.display = 'none';
    uploadPreview.style.display = 'block';
  } else {
    clearImage();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('nome').focus();
};

window.deleteProduct = i => {
  if (!confirm(`Excluir "${products[i].nome}"?`)) return;
  products.splice(i, 1);
  saveAndRender();
  showToast('Produto excluído.', 'error');
};

let toastTimer;
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.className = '', 3000);
}

renderList();