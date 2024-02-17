const express = require('express');
const router = express.Router();
const validator = require('validator'); // Agregar esta línea para importar la biblioteca validator
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    console.log('Datos recibidos en el backend:', req.body);
    const { name, lastName, correo, password } = req.body;

     // Validar el formato del correo electrónico
     if (!validator.isEmail(correo)) {
      return res.status(200).json({ success: false, message: 'El formato del correo electrónico no es válido' });
    }
    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(200).json({ success: false, message: 'El correo electrónico ya está registrado.' });
    }

     // Crear un nuevo usuario con campos telefono y direccion establecidos por defecto
     const newUser = new User({ 
      name, 
      lastName, 
      correo, 
      password, 
      role: "Cliente", 
      telefono: "", 
      direccion: "" 
    });
    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    return  res.status(200).json({ success: true, message: 'Usuario registrado correctamente.' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
});

router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  
  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(200).json({ success: false, message: 'Usuario no encontrado' });
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(200).json({ success: false, message: 'Contraseña incorrecta' });
    }

   
    console.log('Inicio de sesión exitoso.');
    return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso.' });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);    
    return res.status(200).json({ success: false, message: 'Error en el servidor.' });
  }
});





router.get('/profile', async (req, res) => {
  const { correo } = req.query;
  console.log('llego a la funcion de buscar usuario');
  try {
    const usuario = await User.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }
    console.log('consiguio esto:', usuario);
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { name, lastName, correo, password, telefono, direccion } = req.body;
    console.log('esto llego a la funcion de editar usuario',req.body); 
    // Actualizar el perfil del usuario en la base de datos
    const updatedUser = await User.findOneAndUpdate(
      { correo }, // Criterio de búsqueda
      { name, lastName, password, telefono, direccion }, // Datos a actualizar
      { new: true } // Devolver el documento actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Perfil actualizado correctamente.', user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
});

// Ruta para obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await User.find(); // Cambia Usuario.find() a User.find()
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

router.delete('/usuarios/:correo', async (req, res) => {
  const correo = req.params.correo;
  console.log('Este correo llega:', correo); // Verificar el correo recibido en los parámetros de la URL

  try {
    // Buscar y eliminar el usuario con el correo electrónico proporcionado
    const deletedUser = await User.findOneAndDelete({ correo });

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    return res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.', user: deletedUser });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
});

module.exports = router;
