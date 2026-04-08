const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  if (token.startsWith("Bearer ")) token = token.slice(7);

  jwt.verify(token, secret, function(err, decodedToken) {
    if (err) {
      return res.status(401).json({
        success: false,
        message: err.message
      });
    } else {
      req.user = decodedToken;
      next();
    }
  });
};

module.exports = verify;
