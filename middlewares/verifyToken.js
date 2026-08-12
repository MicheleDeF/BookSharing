const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {

    const token = req.cookies.token;

     if (!token) {
        return res.status(401).redirect('/login'); 
    }

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) return res.status(403).redirect('/login');        
        req.user = userPayload;
        next();
    });

}

module.exports = verifyToken;