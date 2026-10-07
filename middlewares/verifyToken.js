const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/** Questo middleware viene utilizzato sulle pagine che richiedono
 *  l'autenticazione dell'utente, nel caso l'utente non sia autenticato 
 *  il middleware effettua il redirect sulla pagina del login "/login".
 */

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