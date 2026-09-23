const { User, Book, Message, Statistic, sequelize  } = require('../models'); 
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const multer = require('multer');
const fs = require('fs');
const path = require('path'); 

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

const getAllBooks = async (req, res) => { 

  try {

    const { page, limit } = req.params;
    
    /** example request /books/1/10 
     * parseInt() function parses a string argument and returns an integer
     */    
    const numberpage = parseInt(page, 10) || 1;    
    const limitbooks = parseInt(limit, 10) || 10;
    const offset = (numberpage - 1) * limitbooks;
    
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

const createNewBook = async (req, res) => {

    const t = await sequelize.transaction();

      try {
                 
         const token = req.cookies.token;
         const decoded = jwt.verify(token, JWT_SECRET);
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

         const newBook = await Book.create({
            title: title.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '), 
            author: author.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '), 
            publish_year: publish_year, 
            category: category, 
            address: address, 
            description: description.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '), 
            cover: imageUrl,
            lat: latitude, 
            lon: longitude,
            userId: userId,
            slug: generateAlias(title),
         },{ transaction: t });
         
         const bookId = newBook.id;
         const views = 0;
         const contacts = 0;

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

const deleteBook = async (req, res) => {

  const t = await sequelize.transaction();

 try {

  const token = req.cookies.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  const id = req.params.id;
  const book = await Book.findOne({ where: { id } });
      
    if (!book) {
          return res.status(404).json({
              success: false,
              message: 'Libro non trovato!'
          });
      }
     
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

}

module.exports = {
  getAllBooks,
  getBook,
  createNewBook,
  deleteBook
};