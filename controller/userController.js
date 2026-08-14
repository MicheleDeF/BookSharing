const { User, Book } = require('../models'); 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const getUserBooks = async (req, res) => {

  const { iduser } = req.params;
  
  try {
    const parsedUserId = Number(iduser);

    if (!Number.isInteger(parsedUserId)) {
      return res.status(400).json({ 
        message: "Errore: 'iduser' deve essere un numero intero valido!" 
      });
    }  

    const user = await User.findByPk(parsedUserId, {
      include: [{
        model: Book,
        as: 'books'
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato!' });
    }

    return res.status(200).json({
      message: 'Richiesta effettuata con successo.',
      user: {
        id: user.id,
        lastName: user.lastName, 
        firstName: user.firstName,
        description: user.description,
        avatar: user.avatar
      },
      books: user.books
    });
  
  } catch (error) {
    return res.status(500).json({ 
      message: "Errore interno del server.",
      error: error.message 
    });
  }
};

const userLogin = async(req, res) =>{

 try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide.' });
    }

   const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    };

    const token = jwt.sign(payload, JWT_SECRET, { 
        expiresIn: '2 days' 
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false ? process.env.PROTUCTION === false : true, 
        maxAge: 3600000 
    });

     req.session.userLogged = {
        logged: true,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
    };

    return res.status(200).json({ message: 'Login effettuato con successo!'});

  } catch (error) {
      return res.status(500).json({ message: error });
  }

}

const userLogout = async (req, res) => {

  if (!req.session) {
    return res.status(400).json({ message: "Nessuna sessione attiva" });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Impossibile effettuare il logout" });
    }
    res
    .clearCookie('token')
    .clearCookie('connect.sid'); 

    return res.status(200).json({ message: "Logout effettuato con successo" });
  });

};

module.exports = {
  getUserBooks,
  userLogin,
  userLogout
};
