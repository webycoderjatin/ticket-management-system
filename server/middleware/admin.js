const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No token, authorization denied' } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: { code: 'UNAUTHORIZED', message: 'Access denied. Requires admin role.' } });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Token is not valid' } });
  }
};