const { Book, Statistic } = require('../models');

const trackBookViews = async (req, res, next) => {

  const { id } = req.params; 
  const userLoggedId = req.session.userLogged ? req.session.userLogged.id : null;

  try {
    
    if (!id) {
       return next(); 
    }        

    if (!req.session.booksViewed) {
        req.session.booksViewed = []; 
    }

    if (req.session.booksViewed.includes(id)) {
       return next(); 
    }

    const book = await Book.findByPk(id);
    
    if (!book) {
       return res.redirect('/404');
    }       
    
    const userId = book.userId;
    const bookId = id;    

    if (userLoggedId && userId.toString() === userLoggedId.toString()) {
      return next(); 
    }

    const [statistic, created] = await Statistic.findOrCreate({
      where: { bookId, userId },
      defaults: { views: 1, contacts: 0 }
    });

    if (!created) {
      await statistic.increment('views', { by: 1 });
    }

    req.session.booksViewed.push(bookId);

    next();

  } catch (error) {
    console.error(error);
    next(); 
  }
};

module.exports = trackBookViews;