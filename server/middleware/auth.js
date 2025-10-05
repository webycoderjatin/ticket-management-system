const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ 
        error: {
            code: 'UNAUTHORIZED',
            message: 'No token, authorization denied'
        }
     });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded.user; 
    next(); 
  } catch (err) {
    res.status(401).json({ 
        error: {
            code: 'UNAUTHORIZED',
            message: 'Token is not valid'
        }
     });
  }
};