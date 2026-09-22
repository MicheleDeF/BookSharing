const { User, Book, Message, Statistic, sequelize} = require('../models'); 
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
};

const userSendMesssageOnDetailBook = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const senderId = decoded.id;    
    const { recipient, text, bookId } = req.body;
    const userId = recipient;

    const message = await Message.create({
      content: text,
      senderId: senderId,
      recipientId: recipient
    }, { transaction: t });  

    const [statistic, created] = await Statistic.findOrCreate({
      where: { bookId, userId },
      defaults: { views: 1, contacts: 0 },
      transaction: t
    });


    if (!created) {
      await statistic.increment('contacts', { by: 1, transaction: t });
    }

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
};

const userUpdateUnreadMessages = async (req, res)=>{

  const t = await sequelize.transaction();

  try {

    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id; 

    const [updatedUnReadMessages] = await Message.update(
      { isRead: 1 },
      { 
        where: { 
          recipientId: userId,
          isRead: 0 
        } 
      }
    );

     await t.commit();

     return res.status(200).json({ 
      message: `Tutti i messaggi sono stati segnati come letti`,
      updatedMessages: updatedUnReadMessages 
    });   
    
  } catch (error) {
    await t.rollback();
    console.error("Errore:", error);
    return res.status(500).json({
      success: false,
      message: "Impossibile completare l'operazione."
    });
  }


};

const userRegistration = async (req, res) =>{
  
  const t = await sequelize.transaction();
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  const salt = bcrypt.genSaltSync(10);
  const styles = ["blobs", "glyphs", "identicon"];
  const index = Math.floor(Math.random() * styles.length);

  
  try {
      /** Utilizzo di api.dicebear (https://www.dicebear.com/how-to-use/http-api/) 
       *  per generare un avatar.
       */
      const avatar = `https://api.dicebear.com/10.x/${styles[index]}/svg?size=200`

      const {
            first_name, 
            last_name, 
            description,
            email, 
            password, 
            password_confirm, 
            address, 
            latitude, 
            longitude, 
            agree_terms 
            } = req.body;

    const user = await User.findOne({ where: { email } });
    
    if (user) {
      return res.status(409).json({
                                   success: false, 
                                   message: "Indirizzo Email già in uso da un altro utente!" 
                                  });
     }


    if(agree_terms !=='on'){
        return res.status(422).json({
                                    success: false, 
                                    message: "E' necessario accettare i termini di servizio!" 
                                  });     
    }

    if(password !== password_confirm){
       return res.status(422).json({
                                    success: false, 
                                    message: "Il valore 'password' e il valore 'conferma password' devono essere uguali!" 
                                  });
    }
    
    if (!passwordRegex.test(password)) {

       return res.status(422).json({
                                    success: false, 
                                    message: "Password non valida. Deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero." 
                                   });
    
  }
    
  
  const passwordHash = bcrypt.hashSync(password, salt);
  
  const newUser = await User.create({
    firstName: first_name.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '),
    lastName: last_name.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '),
    description: description.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '),
    email: email,
    avatar: avatar,
    password_hash: passwordHash,
    address: address,
    lon: longitude,
    lat: latitude  

  }, { transaction: t });
  
   await t.commit();
  
   return res.status(201).json({ 
      success: true,
      message: "Account creato con successo!",
      data: newUser,      
    }); 


    
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Impossibile completare l'operazione."
    });
  }

};


module.exports = {
  getUserBooks,
  userLogin,
  userLogout,
  getUserMessages,
  userSendMessage,
  userSendMesssageOnDetailBook,
  userUpdateUnreadMessages,
  userRegistration
};
