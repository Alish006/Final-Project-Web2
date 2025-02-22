const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1] || req.cookies.token;

  if(token == null){
    res.status(401).json("You are not authenticated !");
  }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
      if(err){
        return res.status(403).json("Token is not valid !");
      }
      req.user = user, 
      next();
    });
};

module.exports = { authenticateToken };
