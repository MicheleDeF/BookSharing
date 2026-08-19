const bookController = require('./bookController');
const userController = require('./userController');

const getHome = async (req, res) => {

    let interceptedData = null;
    const mockResponse = {
      status: function() { return this; }, 
      json: function(data) { interceptedData = data; } 
    };
    req.params = { page: 1, limit: 4 };
    await bookController.getAllBooks(req, mockResponse);
    const latestBooks = interceptedData && interceptedData.books ? interceptedData.books.map(book => typeof book.get === 'function' ? book.get({ plain: true }) : book) : [];
    res.render('home',{
      latestBooks: latestBooks,      
    });  
};


const getInsertBook = (req, res) => {
  res.render('insert-book');
};

const getViewMap = (req, res) => {
  res.render('mappa');
};

const getLogin = (req, res) => {
  res.render('login');
}

const getSignUp = (req, res) => {
  res.render('registration');
};

const getDashboard = async (req, res) => {
    let interceptedData = null;
    try {

    const mockResponse = {
      status: function() { return this; }, 
      json: function(data) { interceptedData = data; } 
    };
      req.params = { iduser: req.session.userLogged.id};
      await userController.getUserBooks(req, mockResponse);
      const userBooks = interceptedData && interceptedData.books.items ? interceptedData.books.items.map(book => typeof book.get === 'function' ? book.get({ plain: true }) : book) : [];
      res.render('dashboard', {userBooks: userBooks});
    } 
    catch (error) {
      res.render('404');
    }    
};

const getBook = async (req, res)=>{    

 try {

    const id = req.params.id;
    const slug = req.params.slug;  
    let interceptedData = null;

    const mockResponse = {
      status: function() { return this; }, 
      json: function(data) { interceptedData = data; } 
    };
    
    await bookController.getBook({ params: { id: id, slug: slug } }, mockResponse);

    if (interceptedData.success) {
       const rawBook = interceptedData.data;
       const cleanBook = rawBook.toJSON ? rawBook.toJSON() : rawBook;
       
       return res.render('book-detail', { 
        detailBook: cleanBook 
      });

    } else {
     
     res.render('404');
    }
       
  } catch (error) {
      res.render('404');
  }    
     
};

const getPageNotFound = (req, res)=>{
    res.render('404');
};


module.exports = {
  getHome,
  getInsertBook,
  getViewMap,
  getLogin,
  getSignUp,
  getDashboard,
  getBook,
  getPageNotFound
};