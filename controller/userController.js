const { User, Book, Message, sequelize} = require('../models'); 
const { Op } = require('sequelize');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const getUserBooks = async (req, res) => {

  const { iduser } = req.params;
  
  try {
    const parsedUserId = Number(iduser);

    if (!Number.isInteger(parsedUserId)) {
      return res.status(400).json({ 
        success: false,
        message: "Errore: 'iduser' deve essere un numero intero valido!" 
      });
    }  

    const user = await User.findByPk(parsedUserId, {
      include: [
        {
          model: Book,
          as: 'books'
        },
        {
          model: Message,
          as: 'SentMessages',
          include: [
            {
              model: User,
              as: 'Recipient'
            }
          ]
        }, 
        {
          model: Message,
          as: 'RecipientMessages',
          include: [
            {
              model: User,
              as: 'Sender'
            }
          ]
        }

           ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utente non trovato!'});
    }

    return res.status(200).json({
      success: true,
      message: 'Richiesta effettuata con successo.',
      user: {
        id: user.id,
        lastName: user.lastName, 
        firstName: user.firstName,
        description: user.description,
        avatar: user.avatar,
        recipientMessages: user.RecipientMessages,
        sentMessages: user.SentMessages
      },
       books:{
         total: (user.books).length,
         items: user.books
       } 
    });
  
  } catch (error) {
    return res.status(500).json({ 
      success: false,
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
      return res.status(401).json({success: false, message: 'Credenziali non valide.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenziali non valide.' });
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
        description: user.description
    };

    return res.status(200).json({ 
                                  success: true,
                                  message: 'Login effettuato con successo!',
                                  id: user.id,
                                  firstName: user.firstName,
                                  lastName: user.lastName, 
                                });

  } catch (error) {
      return res.status(500).json({success: false, message: error });
  }

};

const userLogout = async (req, res) => {

  if (!req.session) {
    return res.status(400).json({ success: false, message: "Nessuna sessione attiva" });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Impossibile effettuare il logout" });
    }
    res
    .clearCookie('token')
    .clearCookie('connect.sid'); 

    return res.status(200).json({ success: true, message: "Logout effettuato con successo" });
  });

};

const getUserMessages = async (req, res) =>{

    const { iduser } = req.params;

    try {

      const parsedUserId = Number(iduser);
      
      if (!Number.isInteger(parsedUserId)) {
        return res.status(400).json({ 
           success: false,
           message: "Errore: 'iduser' deve essere un numero intero valido!" 
        });
      } 

      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: iduser },
            { recipientId: iduser }
          ]
        },
        include: [
          { model: User, as: 'Sender', attributes: ['id', 'lastName', 'firstName'] },
          { model: User, as: 'Recipient', attributes: ['id', 'lastName', 'firstName'] }
        ],
        order: [['createdAt', 'ASC']]
      });


      return res.status(200).json({
            success: true,
            count: messages.length,
            messages: messages
          });
      
    } catch (error) {
      return res.status(500).json({ 
      success: false,
      message: "Errore interno del server.",
      error: error.message 
    });
    }

};

const userSendMessage = async (req, res)=>{

const t = await sequelize.transaction();

try {

  const token = req.cookies.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  const senderId = decoded.id;
  const { recipient, text } = req.body;

  const message = await Message.create({
                                        content: text,
                                        senderId: senderId,
                                        recipientId: recipient
                                        }, { transaction: t }); 
  
  await t.commit();
 
  return res.status(201).json({
      success: true,
      message: "Messaggio inviato con successo!",
      data: message
    });
  
} catch (error) {
  await t.rollback();
  console.error("Errore:", error);
  return res.status(500).json({
      success: false,
      message: "Impossibile completare l'operazione."
    });
}
}

module.exports = {
  getUserBooks,
  userLogin,
  userLogout,
  getUserMessages,
  userSendMessage
};
