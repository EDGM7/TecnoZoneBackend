const express = require('express');
const router = express.Router();
const Producto = require('../models/Productos');

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    // Extraer los datos del producto del cuerpo de la solicitud
    const { nombreInput, descripcionInput, cantidadInput, precio, categoriaInput } = req.body;
    // La ruta del archivo de imagen se guarda en req.file.path
    const imagenInput = req.file.path;

    // Crear un nuevo objeto de producto con los datos recibidos
    const nuevoProducto = new Producto({
      nombreInput,
      descripcionInput,
      cantidadInput,
      categoriaInput,
      precio,
      imagenInput
    });

    // Guardar el nuevo producto en la base de datos
    const productoGuardado = await nuevoProducto.save();

    // Enviar una respuesta con el producto guardado
    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    res.status(500).json({ error: 'Error al guardar el producto' });
  }
});

// Ruta para obtener productos con paginación
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const count = await Producto.countDocuments();
    const productos = await Producto.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({
      totalProductos: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      productos
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});


// Ruta para eliminar un producto
router.delete('/:id', async (req, res) => {
  console.log('llego a eliminar productos');
  try {
    const { id } = req.params;
    await Producto.findByIdAndDelete(id);
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});



// Ruta para buscar productos para galeria
router.get('/buscar', async (req, res) => {
  try {
    console.log('llego a buscar por filtro: ', req.query);
    
    const { nombrepro, descripcionpro, categoria } = req.query;  
    const filtro = {};
    if (nombrepro) filtro.nombreInput = { $regex: new RegExp(nombrepro, 'i') };
    if (descripcionpro) filtro.descripcionInput = { $regex: new RegExp(descripcionpro, 'i') };
    if (categoria) filtro.categoriaInput = categoria;

    console.log('filtro esto: ',filtro);
 
    let productos;
    if (Object.keys(filtro).length > 0) {
      productos = await Producto.find(filtro);
    } else {
      productos = await Producto.find();
    }
    //productos = await Producto.find(filtro).select('nombreInput descripcionInput categoriaInput imagenInput');
    // Enviar los resultados como respuesta
    res.json(productos);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Ruta para buscar productos para editar
router.get('/buscaredit', async (req, res) => {
  console.log('llego a buscar por id:',req.query);
  try {
    const { productId } = req.query;
    //const producto = await Producto.findById(productId);
    //console.log('base:',Producto);
    const producto = await Producto.findById(productId);
    console.log(producto)
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Internal server error' })
  }
});

// Ruta para editar un producto
router.put('/:editar', async (req, res) => { 
  try {
    const { _id, nombreInput, descripcionInput, cantidadInput, precio } = req.body;
    console.log('esto llego a la funcion de editar produc',req.body); 
    // Actualizar el perfil del usuario en la base de datos
    const updatedProducto = await Producto.findOneAndUpdate(
      { _id }, // Criterio de búsqueda
      {  nombreInput, descripcionInput, cantidadInput,precio}, // Datos a actualizar
      { new: true } // Devolver el documento actualizado
    );

    if (!updatedProducto) {
      return res.status(404).json({ success: false, message: 'producto no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Producto actualizado correctamente.', producto: updatedProducto });
    } catch (error) {
    console.error('Error al editar el producto:', error);
    res.status(500).json({ error: 'Error al editar el producto' });
  }
});


module.exports = router;
