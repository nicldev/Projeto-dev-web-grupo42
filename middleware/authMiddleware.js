const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) return res.status(401).send({ message: 'Acesso negado. Nenhum token fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send({ message: 'Token inválido.' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
