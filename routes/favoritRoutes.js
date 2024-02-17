const express = require('express');
const router = express.Router();
const Favoritos = require('../models/favoritos'); // Cambia a '../models/favoritos'


// Ruta para guardar un producto como favorito
router.post('/', async (req, res) => {
    try {
      const { productoId, userId, nombrefavor, descripcionfavor,categoriafavor } = req.body;
  
      console.log('Llegó a favoritos:', req.body);
  
      // Verificar si ya existe un documento con el mismo productoId y userId
      const existingFavorite = await Favoritos.findOne({ productoId, userId });
      if (existingFavorite) {
        return res.status(400).json({ error: 'El producto ya está marcado como favorito por este usuario' });
      }
  
      // Crear un nuevo documento de Favoritos y guardarlo en la base de datos
      const nuevoProductoFavorito = new Favoritos({
        productoId, userId, nombrefavor,
        descripcionfavor,categoriafavor
      });
      await nuevoProductoFavorito.save();
  
      res.status(201).json({ mensaje: 'Producto marcado como favorito correctamente' });
    } catch (error) {
      console.error('Error al marcar como favorito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // Ruta para obtener los productos favoritos de un usuario
router.get('/:correo', async (req, res) => {


    try {
      const { correo } = req.params;
      // Buscar los productos favoritos asociados al correo del usuario
      const productosFavoritos = await Favoritos.find({ userId: correo });
      res.json(productosFavoritos);
    } catch (error) {
      console.error('Error al obtener los productos favoritos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });


// Ruta para obtener los productos favoritos de un usuario
router.get('/', async (req, res) => {
    try {
      const { correoUsuario } = req.query;
  
      // Buscar los productos favoritos asociados al correo del usuario
      const productosFavoritos = await Favoritos.find({ userId: correoUsuario });
      console.log(productosFavoritos);
      res.status(200).json(productosFavoritos);
    } catch (error) {
      console.error('Error al obtener los productos favoritos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // Ruta para eliminar un producto de favoritos
router.delete('/:userId/:productoId', async (req, res) => {
    try {
      const { userId, productoId } = req.params;
  
      // Buscar y eliminar el producto favorito específico asociado al usuario
      await Favoritos.findOneAndDelete({ userId, productoId });
  
      res.status(200).json({ mensaje: 'Producto eliminado de favoritos correctamente' });
    } catch (error) {
      console.error('Error al eliminar el producto de favoritos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  
module.exports = router;
