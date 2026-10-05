/** Questo è il file di avvio dell'applicazione. */

require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const helpers = require('./config/helpers');

/** Definizione del percorso dei file pubblici e dei file js, css utilizzati nel progetto. */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/node_modules/leaflet/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/cropperjs/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery-cropper/dist')));
app.use('/sweetalert2',express.static(path.join(__dirname, '/node_modules/sweetalert2/dist')));
app.use('/leaflet/markercluster',express.static(path.join(__dirname, '/node_modules/leaflet.markercluster/dist')));
app.use('/swiper',express.static(path.join(__dirname, '/node_modules/swiper')));

/** Configurazione che serve a analizzare i dati in formato JSON che arrivano al server tramite le richieste HTTP. */
app.use(express.json());

/** Legge e analizza i cookie inviati dal browser del client al server. */
app.use(cookieParser());

/** Abilita i CORS (Cross-Origin Resource Sharing). */
app.use(cors({
    origin: `${process.env.BASE_PATH}`, 
    allowedHeaders: ['Authorization', 'Content-Type'] 
}));

/** Crea e gestisce le sessioni utente sul server. */
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

/** Miiddleware per recuparare la sessione 'userLogged', in cui sono memorizzate informazioni dell'utente autenticato. */
app.use((req, res, next) => {
    res.locals.userLogged = req.session.userLogged || null;
    next();
});
/** Configurazione per utilizzare Handlebars come motore di templating (View Engine). */
var hbs = exphbs.create({
  defaultLayout: "main",
  extname: ".handlebars",
  helpers: helpers    
});
app.engine('handlebars', hbs.engine);
app.set('view engine', '.handlebars');

/** Le rotte (gli endpoint) dell'applicazione in base alla loro funzione. */
const routeApi = require('./api');
const routePages = require('./routers');
app.use('/', routePages);
app.use('/api', routeApi);

/** Avvia il server Express, mettendolo in "ascolto" delle richieste HTTP in entrata sulla porta 3000 */
app.listen(`${process.env.PORT}`, () => {
  console.log(`Server is running on ${process.env.BASE_PATH}`)
})