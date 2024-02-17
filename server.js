const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017/tecnozonedb';

// Configurar el middleware CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(express.json());

// Configurar multer para manejar los archivos adjuntos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + extension);
  }
});
const upload = multer({ storage: storage });

// Rutas de productos y usuarios
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const favoritRoutes = require('./routes/favoritRoutes');

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar el middleware para dirigir las solicitudes a las rutas adecuadas
app.use('/api/productos', upload.single('imagenInput'), productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favoritos', favoritRoutes);

// Ruta de prueba para verificar que el servidor esté funcionando
app.get('/', (req, res) => {
  res.send('¡El servidor está funcionando!');
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Conexión a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));
