const { test } = require('node:test');
const assert = require('node:assert/strict');
const createServer = require('../src/server');
const Inventory = require('../src/inventory');

async function startServer(t, inventory) {
  const server = createServer(inventory);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

async function postProduct(baseUrl, product) {
  return fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
}

test('el servidor inicia con los tres productos originales', async (t) => {
  const baseUrl = await startServer(t);
  const response = await fetch(`${baseUrl}/api/products`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [
    { name: 'Laptop', price: 12000, stock: 5 },
    { name: 'Mouse', price: 250, stock: 20 },
    { name: 'Teclado', price: 450, stock: 3 }
  ]);
});

test('el servidor entrega la interfaz web', async (t) => {
  const baseUrl = await startServer(t, new Inventory());
  const response = await fetch(baseUrl);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /StockControl/);
});

test('la API permite agregar productos y rechaza duplicados con su mensaje', async (t) => {
  const baseUrl = await startServer(t, new Inventory());
  const product = { name: 'Mouse', price: 250, stock: 10 };

  const created = await postProduct(baseUrl, product);
  assert.equal(created.status, 201);
  assert.deepEqual(await created.json(), product);

  const duplicate = await postProduct(baseUrl, product);
  assert.equal(duplicate.status, 400);
  assert.deepEqual(await duplicate.json(), {
    error: 'El producto "Mouse" ya existe'
  });

  const products = await fetch(`${baseUrl}/api/products`);
  assert.deepEqual(await products.json(), [product]);
});

test('la API calcula el resumen del inventario', async (t) => {
  const baseUrl = await startServer(t, new Inventory());
  await postProduct(baseUrl, { name: 'Laptop', price: 1000, stock: 2 });
  await postProduct(baseUrl, { name: 'Mouse', price: 100, stock: 30 });

  const response = await fetch(`${baseUrl}/api/summary`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    totalValue: 5000,
    productCount: 2,
    lowStock: [{ name: 'Laptop', price: 1000, stock: 2 }]
  });
});

test('la API muestra errores de precio y stock insuficiente', async (t) => {
  const baseUrl = await startServer(t, new Inventory());
  const invalidProduct = await postProduct(baseUrl, {
    name: 'Teclado',
    price: -1,
    stock: 1
  });
  assert.equal(invalidProduct.status, 400);
  assert.deepEqual(await invalidProduct.json(), {
    error: 'El precio debe ser un número mayor o igual a 0'
  });

  await postProduct(baseUrl, { name: 'Teclado', price: 450, stock: 1 });
  const stockResponse = await fetch(
    `${baseUrl}/api/products/${encodeURIComponent('Teclado')}/stock`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: -2 })
    }
  );
  assert.equal(stockResponse.status, 400);
  assert.deepEqual(await stockResponse.json(), {
    error: 'No hay suficiente stock disponible'
  });
});
