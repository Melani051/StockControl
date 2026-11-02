const productList = document.querySelector('#product-list');
const productForm = document.querySelector('#product-form');
const message = document.querySelector('#message');
const searchInput = document.querySelector('#search');
const totalValue = document.querySelector('#total-value');
const productCount = document.querySelector('#product-count');
const emptyState = document.querySelector('#empty-state');
const noResults = document.querySelector('#no-results');
let products = [];
let lowStockNames = new Set();
let messageTimer;

const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
});

async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'No se pudo completar la solicitud');
  }
  return data;
}

function showMessage(text, isError = true) {
  window.clearTimeout(messageTimer);
  message.textContent = text;
  message.classList.toggle('success', !isError);
  message.hidden = false;
  messageTimer = window.setTimeout(() => {
    message.hidden = true;
  }, 4500);
}

function renderProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase('es');
  const visibleProducts = products.filter((product) =>
    product.name.toLocaleLowerCase('es').includes(query)
  );
  productList.replaceChildren();
  productCount.textContent = String(products.length);
  emptyState.hidden = products.length > 0;
  noResults.hidden = products.length === 0 || visibleProducts.length > 0;

  for (const product of visibleProducts) {
    const row = document.createElement('article');
    row.className = 'product-row';

    const info = document.createElement('div');
    info.className = 'product-info';
    const name = document.createElement('span');
    name.className = 'product-name';
    name.textContent = product.name;
    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = `${currency.format(product.price)} por unidad`;
    info.append(name, price);

    const stock = document.createElement('span');
    const isLow = lowStockNames.has(product.name.toLocaleLowerCase('es'));
    stock.className = `stock-badge${isLow ? ' low' : ''}`;
    const dot = document.createElement('span');
    dot.className = 'status-dot';
    dot.setAttribute('aria-hidden', 'true');
    const stockText = document.createElement('span');
    stockText.textContent = `${product.stock} en stock`;
    stock.append(dot, stockText);

    const total = document.createElement('span');
    total.className = 'row-total';
    total.textContent = currency.format(product.price * product.stock);

    const controls = document.createElement('div');
    controls.className = 'stock-controls';
    controls.setAttribute('aria-label', `Actualizar existencias de ${product.name}`);
    for (const [label, quantity, symbol] of [
      ['Registrar salida', -1, '−'],
      ['Registrar entrada', 1, '+']
    ]) {
      const button = document.createElement('button');
      button.className = 'stock-button';
      button.type = 'button';
      button.textContent = symbol;
      button.setAttribute('aria-label', `${label}: ${product.name}`);
      button.dataset.name = product.name;
      button.dataset.quantity = String(quantity);
      controls.append(button);
    }

    row.append(info, stock, total, controls);
    productList.append(row);
  }
}

async function refreshInventory() {
  const [nextProducts, summary] = await Promise.all([
    request('/api/products'),
    request('/api/summary')
  ]);
  products = nextProducts;
  lowStockNames = new Set(
    summary.lowStock.map((product) => product.name.toLocaleLowerCase('es'))
  );
  totalValue.textContent = currency.format(summary.totalValue);
  renderProducts();
}

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const payload = {
    name: formData.get('name').trim(),
    price: Number(formData.get('price')),
    stock: Number(formData.get('stock'))
  };

  try {
    await request('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    productForm.reset();
    showMessage('Producto agregado correctamente.', false);
    await refreshInventory();
  } catch (error) {
    showMessage(error.message);
  }
});

productList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-name]');
  if (!button) return;

  try {
    await request(`/api/products/${encodeURIComponent(button.dataset.name)}/stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: Number(button.dataset.quantity) })
    });
    await refreshInventory();
  } catch (error) {
    showMessage(error.message);
  }
});

searchInput.addEventListener('input', renderProducts);

refreshInventory().catch((error) => {
  showMessage(`No se pudo cargar el inventario: ${error.message}`);
});
