const { User, Book, Message, Statistic, sequelize} = require('../models'); 
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const svgCaptcha = require('svg-captcha');
const JWT_SECRET = process.env.JWT_SECRET;
const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
const salt = bcrypt.genSaltSync(10);
const moderationService = require('../services/moderationService');

/** Questo controller gestisce tutte le operazioni che 
 *  un utente può fare:
 *  login, 
 *  logout, 
 *  registrazione, 
 *  inviare un messaggio
 *  ect..  
 */
/** Questa API restituisce il libri di un determinato utente, passando come parametro 'iduser' */
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
    /** Sintassi Sequelize per ottenere la lista dei libri in base ad uno specifico utente. */
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
/** Questa API viene utilizzata per effettuare il login dell'utente. */
const userLogin = async(req, res) =>{

 try {
    const { email, password } = req.body;
    /** Effattua un check per verificare se l'indirizzo email presente nel 'body' è presente nel database. */
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({success: false, message: 'Credenziali non valide.' });
    }
    
    /** Effettua un check per verificare la password. */
    if (!passwordRegex.test(password)) {
      return res.status(401).json({ success: false, message: 'Credenziali non valide.' });
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
    /** Creazione jwt web token */
    const token = jwt.sign(payload, JWT_SECRET, { 
        expiresIn: '2 days' 
    });
    /** Il jwt viene salvato in un cookie 'token' */
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.PRODUCTION === "true" ? true : false, 
        //maxAge: 3600000 
    });
    /** Crea una sessione 'userLogged' che memorizza informazioni sull'utente loggato. */
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
                                  lat: user.lat,
                                  lon: user.lon,
                                  address: user.address
                                });

  } catch (error) {
      return res.status(500).json({success: false, message: error });
  }

};
/** Questa API effettua il logout dell'utente. */
const userLogout = async (req, res) => {
  
  /** Verifica se esiste la sessione */
  if (!req.session || !req.session.userLogged) {
    return res.status(400).json({ 
      success: false, 
      message: "Nessuna sessione attiva o utente già disconnesso" 
    });
  }

  /** Errore durante la cancellazione della sessione */
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: "Errore interno durante il logout" 
      });
    }   

    /** Elimina i cookies 'token', 'connect.sid' */
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.PRODUCTION === "true" ? true : false,
      sameSite: 'strict'
    }); 

    res.clearCookie('connect.sid', {
      httpOnly: true,
      secure: process.env.PRODUCTION === "true" ? true : false,
      sameSite: 'strict'
    });

    return res.status(200).json({ 
      success: true, 
      message: "Logout effettuato con successo" 
    });
  });
};

/** Questa API restituisce i messaggi inviati e ricevuti di uno specifico utente, tramite parametro 'iduser' */
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
/** Questa API invia un messaggio da parte di uno specifico utente. */
const userSendMessage = async (req, res)=>{

const t = await sequelize.transaction();

try {
  /** Verifica se l'utente è autenticato tramite il jwt web token inviato nella richiesta come cookie. */ 
  const token = req.cookies.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  const senderId = decoded.id;
  const { recipient, text } = req.body;
  const cleanText = moderationService.cleanText(text);
  /** Memorizza il messaggio nella tabella messages. */
  const message = await Message.create({
                                        content: cleanText,
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
/** Questa API è utilizzata per inviare un messaggio direttamente dalla pagina dettaglio libro qualora l'utente è autenticato. */
const userSendMesssageOnDetailBook = async (req, res) => {
  
  const t = await sequelize.transaction();
  
  try {
    /** Verifica se l'utente è autenticato tramite il jwt web token inviato nella richiesta come cookie. */ 
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const senderId = decoded.id;    
    const { recipient, text, bookId } = req.body;
    /** Effattua una pulizia del testo, per eventuali frasi non consentite. */
    const cleanText = moderationService.cleanText(text);
    const userId = recipient;

    const message = await Message.create({
      content: cleanText,
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
/** Questa API imposta i messaggi 'non letti' come 'letti' */
const userUpdateUnreadMessages = async (req, res)=>{

  const t = await sequelize.transaction();

  try {
    /** Verifica se l'utente è autenticato tramite il jwt web token inviato nella richiesta come cookie. */ 
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id; 
    /** Effattua update. */
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
/** Queasta API è utilizzata per la registrazione utente. */
const userRegistration = async (req, res) =>{
  
  const t = await sequelize.transaction();
  /** Stili utilizzati per utilizzare l'API Dicebear */
  const styles = ["blobs", "glyphs", "identicon"];
  /** Genera un indice random, da utilizzare per recuperare in modo random uno stile dall'array 'styles'. */
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
            agree_terms,
            captcha 
            } = req.body;

    if(captcha !== req.session.captcha ){
        return res.status(409).json({
                                success: false, 
                                message: "Captcha non valido!" 
                              });
        }

    const user = await User.findOne({ where: { email } });

    /** Verifica se esiste già un utente con la stessa email. */
    if (user) {
         return res.status(409).json({
                                   success: false, 
                                   message: "Indirizzo Email già in uso da un altro utente!" 
                                  });
     }

    /** Verifica di tutti gli altri dati inviati. */
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
    
  /** Effattua una pulizia di 'description' per parole non consentite. */
  const cleanDescription = moderationService.cleanText(description);
  
  /** Genera la 'password hash'.  */
  const passwordHash = bcrypt.hashSync(password, salt);
  
  /** Memorizza i dati nella tabella 'users'. */
  const newUser = await User.create({
    firstName: first_name.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '),
    lastName: last_name.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '),
    description: cleanDescription.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '),
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

/** Questa API viene utilizzata per modificare i dati dell'utente. */
const editProfileUser = async (req, res)=>{

    const t = await sequelize.transaction();
    
    try {
      /** Verifica se l'utente è autenticato tramite il jwt web token inviato nella richiesta come cookie. */ 
      const token = req.cookies.token;
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id; 
      const {first_name, last_name, description, password, password_confirm} = req.body;  
      const cleanDescription = moderationService.cleanText(description);   

      /** Effettua un check per verificare se l'utente ha modificato anche la password. */
      if(password.length > 0 && password_confirm.length > 0){

        if(password !== password_confirm){
             return res.status(422)
                       .json({
                              success: false, 
                              message: "Il valore 'password' e il valore 'conferma password' devono essere uguali!" 
                            });
          }

          if (!passwordRegex.test(password)) {

                 return res.status(422)
                           .json({
                                  success: false, 
                                  message: "Password non valida. Deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero." 
                                 });
    
           }

           const passwordHash = bcrypt.hashSync(password, salt);

           const [updateProfileUser] = await User.update(
            {
              lastName: last_name.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '),
              firstName: first_name.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '),
              description: cleanDescription.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '),
              password_hash: passwordHash,              
            },
            {
              where: {
                id: userId 
              }
            }
          );

          await t.commit();

          return res.status(200).json({ 
            message: `Operazione completata con successo!`,
            updateProfileUser: updateProfileUser
          }); 

      }else{
          /** L'utente non ha modificato la password ma solo i suoi dati. */
          const [updateProfileUser] = await User.update(
            {
              lastName: last_name,
              firstName: first_name,
              description: cleanDescription,          
            },
            {
              where: {
                id: userId 
              }
            }
          );

         await t.commit();

         return res.status(200).json({ 
          message: `Operazione completata con successo!`,
          updateProfileUser: updateProfileUser
        }); 
      }
      
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({
      success: false,
      message: "Impossibile completare l'operazione."
    });
  }

};

/** Questa API viene utilizzata per generare il svg Captcha. */
const genSvgCaptchaFromRegUser = async (req, res)=>{

    var captcha = svgCaptcha.create({
      size: 4,
      noise: 3,
      color: true,
      background: '#f0f0f0',
    });

    /** Memorizza il testo del  captcha nella sessione*/
    req.session.captcha = captcha.text;
    /** Evita che il  browser salvi l'endpoint '/api/captcha' nella cache */
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, private'
    );
    res.type('svg');
    /** Restituisce un'immagine in formato svg */
    res.status(200).send(captcha.data);
};

module.exports = {
  getUserBooks,
  userLogin,
  userLogout,
  getUserMessages,
  userSendMessage,
  userSendMesssageOnDetailBook,
  userUpdateUnreadMessages,
  userRegistration,
  editProfileUser,
  genSvgCaptchaFromRegUser
};
