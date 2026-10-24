const { test } = require('node:test');
const assert = require('node:assert');
const Inventory = require('../src/inventory');

test('addProduct agrega un producto al inventario', () => {
  const inv = new Inventory();
  inv.addProduct('Mouse', 250, 10);
  assert.strictEqual(inv.products.length, 1);
  assert.strictEqual(inv.findProduct('mouse').stock, 10);
});

test('addProduct rechaza precios negativos', () => {
  const inv = new Inventory();
  assert.throws(() => inv.addProduct('Mouse', -1, 10));
});

test('addProduct rechaza productos duplicados', () => {
  const inv = new Inventory();
  inv.addProduct('Mouse', 250, 10);
  assert.throws(() => inv.addProduct('Mouse', 250, 10));
});

test('updateStock suma y resta unidades', () => {
  const inv = new Inventory();
  inv.addProduct('Teclado', 450, 10);
  inv.updateStock('Teclado', -4);
  assert.strictEqual(inv.findProduct('Teclado').stock, 6);
  inv.updateStock('Teclado', 4);
  assert.strictEqual(inv.findProduct('Teclado').stock, 10);
});

test('updateStock no permite stock negativo', () => {
  const inv = new Inventory();
  inv.addProduct('Teclado', 450, 2);
  assert.throws(() => inv.updateStock('Teclado', -3));
});

test('getTotalValue calcula precio x stock', () => {
  const inv = new Inventory();
  inv.addProduct('Laptop', 1000, 2);
  inv.addProduct('Mouse', 100, 3);
  assert.strictEqual(inv.getTotalValue(), 2300);
});

test('getLowStock regresa productos con poco stock', () => {
  const inv = new Inventory();
  inv.addProduct('Laptop', 1000, 2);
  inv.addProduct('Mouse', 100, 30);
  const bajos = inv.getLowStock(5);
  assert.strictEqual(bajos.length, 1);
  assert.strictEqual(bajos[0].name, 'Laptop');
});
