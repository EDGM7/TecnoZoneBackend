const mongoose = require('mongoose');

// Esquema para los favoritos
const favoritoSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    productoId: { type: String, required: true },
    nombrefavor: { type: String,  required: true },
    descripcionfavor: { type: String,  required: true },
    categoriafavor: { type: String,  required: true  } 
});

// Crea el modelo Favorito utilizando el esquema definido
const Favorito = mongoose.model('Favorito', favoritoSchema);

module.exports = Favorito;
