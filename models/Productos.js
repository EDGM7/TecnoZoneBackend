const mongoose = require('mongoose');

// esquema para los productos
const productoSchema = new mongoose.Schema({
  nombreInput: { type: String,  required: true },
  descripcionInput: { type: String,  required: true },
  cantidadInput: { type: Number,  required: true },
  precio: { type: Number, required: true },
  categoriaInput: { type: String,  required: true  },
  imagenInput: { type: String, required: true }
});

// Crea el modelo de Producto utilizando el esquema definido
const Producto = mongoose.model('Producto', productoSchema, 'Producto');


module.exports = Producto;
