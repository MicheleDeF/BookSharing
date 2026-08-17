const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const verifyToken = require('./middlewares/verifyToken');
const bookController = require('./controller/bookController');
const userController = require('./controller/userController');

app.use(express.static(path.join(__dirname, '/node_modules/leaflet/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/cropperjs/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery-cropper/dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: `${process.env.BASE_PATH}`, 
    allowedHeaders: ['Authorization', 'Content-Type'] 
}));
app.use(session({
    secret: `${process.env.SESSION_SECRET}`, 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        httpOnly: true, 
        secure: false,  
        maxAge: 1000 * 60 * 60 * 24 
    }
}));
app.use((req, res, next) => {
    res.locals.userLogged = req.session.userLogged || null;
    next();
});

var hbs = exphbs.create({
  defaultLayout: "main",
  extname: ".handlebars",
  helpers: {
    section: function(name, options) { 
      if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this); 
        return null;
      },
      getCurrentYear: () => new Date().getFullYear(),
      truncate: function (str, len) {
      if (str && str.length > len) {
        return str.substring(0, len) + '...';
      }
      return str;
    },
    json: (context) => JSON.stringify(context),
    limit: (arr, limit)=>{
        if (!Array.isArray(arr)) { return []; }
         return arr.slice(0, limit);
    }
  }    
});

app.engine('handlebars', hbs.engine);
app.set('view engine', '.handlebars');

app.get('/', async (req, res) => {
    
    let interceptedData = null;
    /** mocks the response object, simulating a request to the url '/api/books/' */
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
});

app.get('/insert-book', verifyToken, (req, res) => {
  res.render('insert-book');
});

app.get('/view-map', (req, res) => {
  res.render('mappa');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/sign-up', (req, res) => {
  res.render('registration');
});

app.get('/dashboard', verifyToken, async (req, res) => {
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
    } catch (error) {
      res.render('dashboard');
    }
  
  
    
});

const routeApi = require('./api');

app.use('/api', routeApi);

app.listen(`${process.env.PORT}`, () => {
  console.log(`Server is running on ${process.env.BASE_PATH}`)
})