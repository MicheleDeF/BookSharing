const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

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
    },
     customizeData: function (d) {
      if (!d) return '';
      const data = new Date(d);
      return data.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }    
});
app.engine('handlebars', hbs.engine);
app.set('view engine', '.handlebars');

const routeApi = require('./api');
const routePages = require('./routers');
app.use('/', routePages);
app.use('/api', routeApi);

app.listen(`${process.env.PORT}`, () => {
  console.log(`Server is running on ${process.env.BASE_PATH}`)
})