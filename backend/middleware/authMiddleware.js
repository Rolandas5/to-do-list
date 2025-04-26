const jwt = require('jsonwebtoken');
const util = require('util');

// Konvertuojam jwt.verify į pažadą
const verifyToken = util.promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
