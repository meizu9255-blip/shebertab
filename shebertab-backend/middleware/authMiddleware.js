const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_here';

// Token verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Авторизация қажет (Токен жоқ)' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // payload contains id, email, name, role
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Жарамсыз немесе мерзімі біткен токен' });
  }
};

// Role-based access control middleware
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Авторизацияланбаған' });
    }
    
    // Check if the user has the exact required role
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Access denied. Қол жеткізуге рұқсат жоқ (Қажетті рөл: ${role})` });
    }
    
    next();
  };
};

// You can also create more complex checks like an array of roles
const requireRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Рұқсат жоқ' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  requireRoles
};
