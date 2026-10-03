const { User, Book, Message, Statistic, sequelize  } = require('../models'); 
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require('fs').promises;
const path = require('path'); 
/** questa espressione regolare viene utilizzato per effettuare un controllo sul formato del nome dell'immagine. */
const regex = /^\d+-\d+-copertina\.jpg$/;
/** Il service 'moderationService' viene utilizzato per moderare il testo inserito dagli utenti. 
 *  Descrizioni libro e utente, messaggi. 
 */
const moderationService = require('../services/moderationService');

/** Questo è il controller per gestire i libri,
 *  funzioni per eseguire le operazioni CRUD
 */

/** Questa funzione (generateAlias) genera l'url per aprire il dettaglio
 *  del libro nel browser.
 */
function generateAlias(text) {
    if (!text) return '';

    return text
        .toString()
        .toLowerCase()                  
        .trim()                         
        .normalize('NFD')               
        .replace(/[\u0300-\u036f]/g, '') 
        .replace(/[^a-z0-9 -]/g, '')    
        .replace(/\s+/g, '-')           
        .replace(/-+/g, '-');           
};
/** Api per ottenere la lista completa dei libri, i risultati sono impaginati usando il valore 'limit' nella richiesta. */
const getAllBooks = async (req, res) => { 

  try {

    const { page, limit } = req.params;
    
    /** example request /books/1/10 
     * parseInt() La funzione analizza un argomento di tipo stringa e restituisce un numero intero.
     */    
    const numberpage = parseInt(page, 10) || 1;    
    const limitbooks = parseInt(limit, 10) || 10;
    const offset = (numberpage - 1) * limitbooks;
    
    /** Sintassi Sequelize per ottenre la lista. */
    const { count, rows: books } = await Book.findAndCountAll({
      limit: limitbooks,
      offset: offset,  
      order: [['id', 'DESC']],
      include: [{
        model: User,
        as: 'user', 
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'description'] 
      }]
    });

    return res.status(200).json({
      success: true,
      message: 'Libri recuperati con successo.',
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / limitbooks),
        currentPage: numberpage,
        itemsForPage: limitbooks
      },
      books: books
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Errore interno del server durante il recupero dei libri.",
      error: error.message
    });
  }
};

/** Questa API consente di ottenere un singolo libro in base ai parametri passati nella richiesta 'id', 'slug'. */
const getBook = async (req, res) => {

  const {id, slug} = req.params;

  try {

     const parseIdbook = Number(id);

    if (!Number.isInteger(parseIdbook)) {
      return res.status(400).json({ 
        success: false,
        message: "Errore: 'id' deve essere un numero intero valido!" 
      });
    } 
     
     const book = await Book.findOne(  
       {
        where: {
         id: id,
         slug: slug
       },
        include: [{model: User,as: 'user',attributes: ['id','firstName','lastName','avatar','description']}]
     });

    if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Libro non trovato'
            });
     }

     return res.status(200).json({
            success: true,
            data: book
        });


    
  } catch (error) {
      return res.status(500).json({
            success: false,
            message: 'Errore interno del server'
        });
  }

};

/** Questa API consente di creare un nuovo libro in base ai dati inviati al server dall'utente,
 *  carica l'immagine nella posizione specificata nella configurazione 'config\multer.js'.
 */
const createNewBook = async (req, res) => {

    const t = await sequelize.transaction();

      try {
         /** Verifica se l'utente è autenticato tramite il jwt web token inviato nella richiesta come cookie. */        
         const token = req.cookies.token;
         const decoded = jwt.verify(token, JWT_SECRET);
         /** Ottengo l' "userId" dal token per poi utilizzarlo per recuperare le coordinate geografiche dell'utente,
          *  questo perchè il libro verrà salvato nella stessa posizione geografica del propritario del libro.
          */
         const userId = decoded.id, id = decoded.id;
         const user = await User.findOne({ where: { id } });
         const latitude = user.lat; 
         const longitude = user.lon;
         const address = user.address;
      
          if (!req.file) {
             return res.status(400).json({ success: false,  message: 'Nessuna Immagine di Copertina!' });
           }
        
         const imageUrl = `${req.protocol}://${req.get('host')}/images/books/${req.file.filename}`;         
         const {title, author, publish_year, category, description} = req.body;
         /** Effettuo una pulizia della 'description' se vi sono caratteri non ammessi. */
         const cleanDescription = moderationService.cleanText(description);
        /** Creazione libro con la sintassi Sequelize. */
         const newBook = await Book.create({
            title: title.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '), 
            author: author.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '), 
            publish_year: publish_year, 
            category: category, 
            address: address, 
            description: cleanDescription.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '), 
            cover: imageUrl,
            lat: latitude, 
            lon: longitude,
            userId: userId,
            slug: generateAlias(title),
         },{ transaction: t });
         
         const bookId = newBook.id;
         const views = 0;
         const contacts = 0;
         /** Dopo la creazione del libro creo una nuova riga nella tabella 'statistics' relativa al libro creato. */
         const newStatistic = await Statistic.create({
            views: views,
            contacts: contacts,
            bookId: bookId,
            userId: userId,
        },{ transaction: t });
         
         await t.commit();
          
         res.status(201).json({
              success: true,
              message: 'Nuovo libro salvato con successo!',
              book: newBook,
              statistic: newStatistic,     
            });      

        
      } catch (error) {
         await t.rollback();
         console.error(error);
         return res.status(500).json({ success: false, message: 'Errore interno durante il salvataggio!'});
      }
};
/** Questa API cancella uno specifico libro. */
const deleteBook = async (req, res) => {

  const t = await sequelize.transaction();

 try {
  /** Verifica se l'utente è autenticato tramite il jwt web token inviato nella richiesta come cookie. */ 
  const token = req.cookies.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  const id = req.params.id;
  /** Effettuo un check per verificare se i libro da cancellare esiste. */
  const book = await Book.findOne({ where: { id } });
      
    if (!book) {
          return res.status(404).json({
              success: false,
              message: 'Libro non trovato!'
          });
      }

      const cover = book.cover;
      const urlObj = new URL(cover);
      const nameFile = path.basename(urlObj.pathname);

      if (!nameFile || nameFile === '/' || nameFile === '.') {
        return res.status(400).json({ success: false, message: 'Nessun file valido trovato nell\'URL'});
      }
      
      const uploads_folder = path.join(__dirname, '..', 'public', 'images/books');
      const pathFile = path.join(uploads_folder, nameFile);    

      if (!pathFile.startsWith(uploads_folder)) {
        return res.status(401).json({ success: false, message: 'Tentativo di accesso non autorizzato!'});
      }
      
      /** Cancellazione dell'immagine del libro cancellato. */
      if (regex.test(nameFile)) {
        await fs.unlink(pathFile);
      }      

      /** Cancellazione del libro. */
      const deletedBook = await Book.destroy({
        where: { id: id }
      }, { transaction: t });

  
    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Libro eliminato con successo!',
      deletedBook: deletedBook,
    }); 

  
 } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ success: false, message: 'Errore interno durante la procedura di eliminazione!'});
 }

};
/** Questa API è utilizzata per modificare un libro. */
const editBook = async (req, res) => {

  const t = await sequelize.transaction();

  try {
  /** Verifica se l'utente è autenticato tramite il jwt web token inviato nella richiesta come cookie. */ 
  const token = req.cookies.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  const id = req.params.id;
   /** Effettuo un check per verificare se i libro da modificare esiste. */
  const book = await Book.findOne({ where: { id } });

    if (!req.file) {        
        return res.status(400).json({ success: false,  message: 'Nessuna Immagine di Copertina!' });
      }

    if (!book) {
          return res.status(404).json({
              success: false,
              message: 'Libro non trovato!'
          });
      }

    const cover = book.cover;
    const urlObj = new URL(cover);
    const nameFile = path.basename(urlObj.pathname);

      if (!nameFile || nameFile === '/' || nameFile === '.') {
        return res.status(400).json({ success: false, message: 'Nessun file valido trovato nell\'URL'});
      }

    const uploads_folder = path.join(__dirname, '..', 'public', 'images/books');
    const pathFile = path.join(uploads_folder, nameFile);         

      if (!pathFile.startsWith(uploads_folder)) {
        return res.status(401).json({ success: false, message: 'Tentativo di accesso non autorizzato!'});
      }

      if (regex.test(nameFile)) {
        await fs.unlink(pathFile);
      }  

    const imageUrl = `${req.protocol}://${req.get('host')}/images/books/${req.file.filename}`;  
    const {title, author, publish_year, category, description} = req.body;
    const cleanDescription = moderationService.cleanText(description);
    /** Effettuo l'update del libro con i nuovi dati. */
    const [updateBook] = await Book.update(
      {
	     title: title.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '), 
       author: author.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '), 
       publish_year: publish_year,
       category: category,
       description: cleanDescription.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '), 
       cover: imageUrl,
       slug: generateAlias(title),
      },
      { where: { id: id }}, 
      { transaction: t });    
   
      await t.commit();
      res.status(201).json({
        success: true,
        message: 'Libro modifcato con successo!',
        updateBook: updateBook
      });   

    
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ success: false, message: 'Errore interno durante la procedura di modifica!'});
  }

};
/** Questa API viene utilizzata per impostare un libro 'disponibile' o 'non disponibile' */
const updateAvailabilityBook = async (req, res) => {
   const t = await sequelize.transaction();
   try {
     /** Verifica se l'utente è autenticato tramite il jwt web token inviato nella richiesta come cookie. */ 
     const token = req.cookies.token;
     const decoded = jwt.verify(token, JWT_SECRET);
     const id = req.params.id;
     const { availability } = req.body;
     
     const book = await Book.findOne({ where: { id } });

     if (!book) {
          return res.status(404).json({
              success: false,
              message: 'Libro non trovato!'
          });
      }

      const [updateAvailability] = await Book.update({
         availability: availability
      },
      { where: { id: id }},
      { transaction: t });

      await t.commit();

      res.status(201).json({
        success: true,
        message: 'Disponibilià libro modifcata con successo!',
        updateAvailability: updateAvailability
        
      });

    
   } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ success: false, message: 'Errore interno durante la procedura di eliminazione!'});
    
   }

};

module.exports = {
  getAllBooks,
  getBook,
  createNewBook,
  deleteBook,
  editBook,
  editBook,
  updateAvailabilityBook
};