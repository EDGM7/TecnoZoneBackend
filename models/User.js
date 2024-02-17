const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true }, 
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  telefono: {type: String, default: '' },
  direccion: { type: String, default: ''}
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log("Contraseña proporcionada por el usuario:", candidatePassword);
    console.log("Contraseña almacenada en la base de datos:", this.password);
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log("¿Las contraseñas coinciden?", result);
    return result;
  } catch (error) {
    console.error("Error al comparar contraseñas:", error);
    throw new Error(error);
  }
};

userSchema.pre('save', async function(next) {
  const user = this;
  console.log("Middleware pre-save ejecutándose...");
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    console.log("Contraseña hasheada:", hashedPassword);
    user.password = hashedPassword;
    next();
  } catch (error) {
    console.error("Error al hashear la contraseña:", error);
    next(error);
  }
});

userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, 'jwtSecretKey');
};

const User = mongoose.model('User', userSchema);
userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, 'jwtSecretKey');
};


module.exports = User;
