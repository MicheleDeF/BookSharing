const { Book, User } = require('../models'); 

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


module.exports = {
  getAllBooks,
  getBook
};