const test = require('node:test');
const assert = require('node:assert/strict');
const { encontrarProductoPorCodigo, normalizarProductoParaFormulario } = require('../public/openfood.js');

test('normaliza los datos de un producto para el formulario', () => {
  const producto = normalizarProductoParaFormulario({
    nombre: 'Leche entera',
    categoria: 'Lácteos',
    descripcion: 'Leche pasteurizada',
    marca: 'La Serenísima',
    imagen: 'https://example.com/leche.jpg',
    precio: 1200,
    cantidad: 10,
    proveedor: 'Distribuidora A',
    codigoBarras: '7791234567890'
  });

  assert.deepEqual(producto, {
    nombre: 'Leche entera',
    categoria: 'Lácteos',
    descripcion: 'Leche pasteurizada',
    marca: 'La Serenísima',
    imagen: 'https://example.com/leche.jpg',
    precio: 1200,
    cantidad: 10,
    proveedor: 'Distribuidora A',
    codigoBarras: '7791234567890'
  });
});

test('encuentra un producto registrado por su código de barras', () => {
  const productos = [
    { nombre: 'Arroz', codigoBarras: '7790001112223' },
    { nombre: 'Azúcar', codigoBarras: '7790003334445' }
  ];

  const encontrado = encontrarProductoPorCodigo(productos, '7790001112223');
  assert.equal(encontrado.nombre, 'Arroz');
});

test('encuentra un producto registrado por su ID', () => {
  const productos = [
    { id: '1783645411546', nombre: 'Celular' },
    { id: '1783732026219', nombre: 'Laptop' }
  ];

  const encontrado = encontrarProductoPorCodigo(productos, '1783732026219');
  assert.equal(encontrado.nombre, 'Laptop');
});
