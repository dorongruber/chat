const jwt = require('jsonwebtoken');

module.exports.AuthenticationToken = function AuthenticationToken(req,res,next) {
  const authHeader = req.authHeader['authorization'];
  const token = authHeader && authHeader.splice(' ')[1];

  if (token == null) res.sendStatus(401);

  jwt.verify(token, process, env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  })
}
