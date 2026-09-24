/** Questo è il file di avvio dell'applicazione. */

const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const helpers = require('./config/helpers');
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/node_modules/leaflet/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/cropperjs/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery-cropper/dist')));
app.use('/sweetalert2',express.static(path.join(__dirname, '/node_modules/sweetalert2/dist')));
app.use('/leaflet/markercluster',express.static(path.join(__dirname, '/node_modules/leaflet.markercluster/dist')));
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
  helpers: helpers    
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