const http = require('node:http');
const path = require('node:path');
const { readFile } = require('node:fs/promises');
const createDefaultInventory = require('./default-inventory');

const publicDirectory = path.join(__dirname, '..', 'public');
const staticFiles = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8']
};
const maxBodySize = 1024 * 1024;

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBodySize) {
        reject(Object.assign(new Error('El cuerpo de la solicitud es demasiado grande'), {
          statusCode: 413
        }));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error('El cuerpo debe contener JSON válido'), {
          statusCode: 400
        }));
      }
    });
    request.on('error', reject);
  });
}

function createServer(inventory = createDefaultInventory()) {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const pathname = url.pathname;

    try {
      if (pathname === '/api/products' && request.method === 'GET') {
        sendJson(response, 200, inventory.products);
        return;
      }

      if (pathname === '/api/products' && request.method === 'POST') {
        const body = await readJsonBody(request);
        const product = inventory.addProduct(body?.name, body?.price, body?.stock);
        sendJson(response, 201, product);
        return;
      }

      if (pathname === '/api/summary' && request.method === 'GET') {
        sendJson(response, 200, {
          totalValue: inventory.getTotalValue(),
          productCount: inventory.products.length,
          lowStock: inventory.getLowStock()
        });
        return;
      }

      const stockMatch = pathname.match(/^\/api\/products\/([^/]+)\/stock$/);
      if (stockMatch && request.method === 'POST') {
        let name;
        try {
          name = decodeURIComponent(stockMatch[1]);
        } catch {
          sendJson(response, 400, { error: 'El nombre del producto no es válido' });
          return;
        }

        const body = await readJsonBody(request);
        if (!Number.isInteger(body?.quantity)) {
          sendJson(response, 400, { error: 'La cantidad debe ser un número entero' });
          return;
        }
        sendJson(response, 200, inventory.updateStock(name, body.quantity));
        return;
      }

      if (request.method === 'GET' && staticFiles[pathname]) {
        const [fileName, contentType] = staticFiles[pathname];
        const content = await readFile(path.join(publicDirectory, fileName));
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content);
        return;
      }

      sendJson(response, 404, { error: 'Ruta no encontrada' });
    } catch (error) {
      if (!response.headersSent) {
        sendJson(response, error.statusCode || 400, {
          error: error.message || 'Ocurrió un error al procesar la solicitud'
        });
      } else {
        response.destroy(error);
      }
    }
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(3000, () => {
    console.log('StockControl está disponible en http://localhost:3000');
  });
}

module.exports = createServer;
