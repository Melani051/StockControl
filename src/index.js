// Demostración de StockControl por línea de comandos.
const Inventory = require('./inventory');

const inventory = new Inventory();

inventory.addProduct('Laptop', 12000, 5);
inventory.addProduct('Mouse', 250, 20);
inventory.addProduct('Teclado', 450, 3);

inventory.updateStock('Mouse', -5); // se venden 5 mouse
inventory.updateStock('Teclado', 10); // llegan 10 teclados

console.log('=== StockControl ===');
console.table(inventory.products);
console.log('Valor total del inventario: $' + inventory.getTotalValue());

const bajos = inventory.getLowStock(5);
console.log(
  'Productos con stock bajo:',
  bajos.length ? bajos.map((p) => p.name).join(', ') : 'ninguno'
);
