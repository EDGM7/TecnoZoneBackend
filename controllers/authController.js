const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, 'tu-secreto', { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, 'tu-secreto');
};

module.exports = { generateToken, verifyToken };
