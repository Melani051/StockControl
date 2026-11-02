const Inventory = require('./inventory');

function createDefaultInventory() {
  const inventory = new Inventory();
  inventory.addProduct('Laptop', 12000, 5);
  inventory.addProduct('Mouse', 250, 20);
  inventory.addProduct('Teclado', 450, 3);
  return inventory;
}

module.exports = createDefaultInventory;
