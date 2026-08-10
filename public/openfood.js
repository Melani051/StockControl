// Búsqueda local de productos por código de barras o ID
(function (global) {
  function limpiarTexto(valor) {
    if (valor === null || valor === undefined) return '';
    return String(valor).trim().replace(/\s+/g, ' ');
  }

  function obtenerHeadersAutenticacion() {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
      if (!usuario) return {};

      return {
        'x-usuario-id': String(usuario.id),
        'x-usuario-rol': usuario.rol
      };
    } catch (error) {
      return {};
    }
  }

  function normalizarProductoParaFormulario(producto) {
    return {
      nombre: limpiarTexto(producto.nombre || ''),
      categoria: limpiarTexto(producto.categoria || ''),
      descripcion: limpiarTexto(producto.descripcion || ''),
      marca: limpiarTexto(producto.marca || ''),
      imagen: limpiarTexto(producto.imagen || ''),
      precio: producto.precio ?? '',
      cantidad: producto.cantidad ?? '',
      proveedor: limpiarTexto(producto.proveedor || ''),
      codigoBarras: limpiarTexto(producto.codigoBarras || '')
    };
  }

  function encontrarProductoPorCodigo(productos, codigo) {
    const textoNormalizado = limpiarTexto(codigo).toLowerCase();

    return productos.find((producto) => {
      const codigoBarras = limpiarTexto(producto.codigoBarras || '').toLowerCase();
      const id = limpiarTexto(producto.id || '').toLowerCase();
      const nombre = limpiarTexto(producto.nombre || '').toLowerCase();

      return (
        codigoBarras === textoNormalizado ||
        id === textoNormalizado ||
        codigoBarras.includes(textoNormalizado) ||
        id.includes(textoNormalizado) ||
        nombre.includes(textoNormalizado)
      );
    });
  }

  async function buscarProductoOpenFood(codigo) {
    const codigoNormalizado = limpiarTexto(codigo);
    if (!codigoNormalizado) return { found: false };

    try {
      const respuesta = await fetch('/productos', {
        headers: obtenerHeadersAutenticacion()
      });

      if (!respuesta.ok) return { found: false };

      const productos = await respuesta.json();
      const producto = encontrarProductoPorCodigo(productos, codigoNormalizado);

      if (!producto) return { found: false };

      return {
        found: true,
        producto: normalizarProductoParaFormulario(producto)
      };
    } catch (error) {
      console.error('Error al buscar producto local:', error);
      return { found: false };
    }
  }

  global.buscarProductoOpenFood = buscarProductoOpenFood;
  global.encontrarProductoPorCodigo = encontrarProductoPorCodigo;
  global.normalizarProductoParaFormulario = normalizarProductoParaFormulario;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buscarProductoOpenFood, encontrarProductoPorCodigo, normalizarProductoParaFormulario };
  }
})(typeof window !== 'undefined' ? window : globalThis);
