// Módulo principal de StockControl: lógica del inventario.

class Inventory {
  constructor() {
    this.products = [];
  }

  // Agrega un producto nuevo al inventario.
  addProduct(name, price, stock) {
    if (!name || typeof name !== 'string') {
      throw new Error('El nombre del producto es obligatorio');
    }
    if (typeof price !== 'number' || price < 0) {
      throw new Error('El precio debe ser un número mayor o igual a 0');
    }
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error('El stock debe ser un entero mayor o igual a 0');
    }
    if (this.findProduct(name)) {
      throw new Error(`El producto "${name}" ya existe`);
    }
    const product = { name, price, stock };
    this.products.push(product);
    return product;
  }

  // Busca un producto por nombre (sin distinguir mayúsculas).
  findProduct(name) {
    return this.products.find(
      (p) => p.name.toLowerCase() === String(name).toLowerCase()
    );
  }

  // Suma o resta unidades al stock de un producto.
  updateStock(name, quantity) {
    const product = this.findProduct(name);
    if (!product) {
      throw new Error(`El producto "${name}" no existe`);
    }
    if (product.stock + quantity < 0) {
      throw new Error('No hay suficiente stock disponible');
    }
    product.stock += quantity;
    return product;
  }

  // Valor total del inventario (precio x stock de cada producto).
  getTotalValue() {
    return this.products.reduce((total, p) => total + p.price * p.stock, 0);
  }

  // Productos con stock menor o igual al límite indicado.
  getLowStock(limit = 5) {
    return this.products.filter((p) => p.stock <= limit);
  }
}

module.exports = Inventory;
