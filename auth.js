const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};
	return jwt.sign(data, secret, {});
}

const verify = (req, res, next) => {
    let token = req.headers.authorization;

    if(typeof token === "undefined"){
        return res.send({ auth: "Failed. No Token" });
    } else {
    //slice yung token para hindi mainclude yung bearer	
        token = token.slice(7, token.length);
        jwt.verify(token, secret, function(err, decodedToken){
            if(err){
                return res.send({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                req.user = decodedToken;
                next();
            }
        })
    }
};

const verifyAdmin = (req, res, next) => {
	if(req.user.isAdmin){
		next();
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}

module.exports = { createAccessToken, verify, verifyAdmin };
